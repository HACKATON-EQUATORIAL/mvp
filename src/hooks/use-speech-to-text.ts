"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_AUDIO_BYTES, MAX_RECORDING_SECONDS } from "@/lib/stt/constants";
import { getRecordingError, getRecordingMimeType } from "@/lib/stt/recording";
import { audioFileSchema } from "@/lib/stt/schemas";
import { requestTranscription } from "@/lib/stt/transcribe-client";

export type SpeechPhase =
  | "idle"
  | "requesting"
  | "recording"
  | "transcribing"
  | "success"
  | "error";

export function useSpeechToText() {
  const [phase, setPhase] = useState<SpeechPhase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [lastAudio, setLastAudio] = useState<File | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const upload = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const busy = useRef(false);

  const releaseCapture = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
    interval.current = null;
    if (recorder.current) {
      recorder.current.onstop = null;
      recorder.current.ondataavailable = null;
      recorder.current.onerror = null;
      if (recorder.current.state !== "inactive") recorder.current.stop();
      recorder.current = null;
    }
    for (const track of stream.current?.getTracks() ?? []) {
      track.onended = null;
      track.stop();
    }
    stream.current = null;
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      // O prompt de permissão pode ocultar a página no Android. Não cancelar
      // getUserMedia pendente; interromper somente captura/envio já iniciados.
      if (
        document.visibilityState === "hidden" &&
        (recorder.current !== null || upload.current !== null)
      ) {
        generation.current += 1;
        releaseCapture();
        upload.current?.abort();
        upload.current = null;
        busy.current = false;
        setPhase((current) =>
          ["recording", "requesting", "transcribing"].includes(current)
            ? "idle"
            : current,
        );
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      generation.current += 1;
      releaseCapture();
      upload.current?.abort();
      upload.current = null;
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [releaseCapture]);

  function cancel() {
    generation.current += 1;
    releaseCapture();
    upload.current?.abort();
    upload.current = null;
    busy.current = false;
    setPhase("idle");
    setError("");
  }

  async function transcribe(file: File, token: number) {
    const validated = audioFileSchema.safeParse(file);
    if (!validated.success) {
      busy.current = false;
      setError(validated.error.issues[0].message);
      setPhase("error");
      return;
    }
    setPhase("transcribing");
    setError("");
    const controller = new AbortController();
    upload.current = controller;
    try {
      const result = await requestTranscription(file, controller.signal);
      if (generation.current !== token) return;
      setText(result.text);
      setPhase("success");
    } catch (cause) {
      if (generation.current !== token) return;
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível transcrever a gravação.",
      );
      setPhase("error");
    } finally {
      if (generation.current === token) {
        upload.current = null;
        busy.current = false;
      }
    }
  }

  function finishRecording() {
    if (recorder.current?.state === "recording") {
      setPhase("transcribing");
      recorder.current.stop();
    }
  }

  async function startRecording() {
    if (busy.current) return;
    busy.current = true;
    const token = ++generation.current;
    setError("");
    setText("");
    setLastAudio(null);
    setSeconds(0);
    setPhase("requesting");
    try {
      const mimeType = getRecordingMimeType();
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (generation.current !== token) {
        for (const track of media.getTracks()) track.stop();
        return;
      }
      if (document.visibilityState === "hidden") {
        for (const track of media.getTracks()) track.stop();
        busy.current = false;
        setError("Volte para esta página e toque em gravar novamente.");
        setPhase("error");
        return;
      }
      stream.current = media;
      const current = new MediaRecorder(media, { mimeType });
      recorder.current = current;
      const chunks: Blob[] = [];
      let size = 0;
      current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          size += event.data.size;
        }
        if (size > MAX_AUDIO_BYTES && current.state === "recording")
          finishRecording();
      };
      const recordingFailed = () => {
        if (generation.current !== token) return;
        generation.current += 1;
        releaseCapture();
        busy.current = false;
        setError("A gravação foi interrompida. Tente novamente.");
        setPhase("error");
      };
      current.onerror = recordingFailed;
      current.onstop = () => {
        if (generation.current !== token) return;
        const type = current.mimeType || mimeType;
        const extension = type.includes("mp4")
          ? "m4a"
          : type.includes("ogg")
            ? "ogg"
            : "webm";
        const file = new File(chunks, `gravacao.${extension}`, { type });
        releaseCapture();
        if (file.size <= MAX_AUDIO_BYTES && file.size > 0) setLastAudio(file);
        void transcribe(file, token);
      };
      for (const track of media.getTracks()) track.onended = recordingFailed;
      current.start(1000);
      setPhase("recording");
      const started = Date.now();
      interval.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - started) / 1000);
        setSeconds(Math.min(elapsed, MAX_RECORDING_SECONDS));
        if (elapsed >= MAX_RECORDING_SECONDS) finishRecording();
      }, 250);
    } catch (cause) {
      if (generation.current !== token) return;
      releaseCapture();
      busy.current = false;
      setError(getRecordingError(cause));
      setPhase("error");
    }
  }

  function retry() {
    if (busy.current || !lastAudio) return;
    busy.current = true;
    void transcribe(lastAudio, ++generation.current);
  }

  return {
    phase,
    seconds,
    text,
    error,
    canRetry: phase === "error" && lastAudio !== null,
    pending: phase === "requesting" || phase === "transcribing",
    startRecording,
    finishRecording,
    cancel,
    retry,
  };
}
