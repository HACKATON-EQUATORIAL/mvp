"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useAudioSpectrum } from "@/hooks/use-audio-spectrum";
import type { SpeechPhase } from "@/hooks/use-speech-to-text";

export function VoiceAudioDock({
  phase,
  seconds = 0,
  stream = null,
  hasTranscript = false,
  onStart,
  onFinish,
  onCancel,
}: {
  phase: SpeechPhase;
  seconds?: number;
  stream?: MediaStream | null;
  hasTranscript?: boolean;
  onStart: () => void;
  onFinish: () => void;
  onCancel: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const level = useMotionValue(0);
  const amplitude = useTransform(level, [0, 1], [1, 1.08]);
  const scale = useSpring(amplitude, { stiffness: 180, damping: 22 });
  const onLevel = useCallback((value: number) => level.set(value), [level]);
  const recording = phase === "recording";
  const pending = phase === "requesting" || phase === "transcribing";
  const { canvasRef, unavailable } = useAudioSpectrum({
    stream: recording ? stream : null,
    reducedMotion: !!reducedMotion,
    onLevel,
  });
  const label = recording
    ? "Parar e transcrever"
    : phase === "requesting"
      ? "Aguardando microfone"
      : phase === "transcribing"
        ? "Transcrevendo áudio"
        : hasTranscript || phase === "error"
          ? "Gravar outra mensagem"
          : "Gravar áudio";

  return (
    <section className="voice-audio-dock" aria-label="Controles de voz">
      <div className="voice-audio-composer" data-phase={phase}>
        <div className="voice-audio-feedback">
          <p className="voice-audio-status" role="status">
            {recording ? "Gravando" : pending ? label : "Responda por voz"}
          </p>
          {recording ? (
            <div className="voice-spectrum-row">
              <canvas
                ref={canvasRef}
                className="voice-spectrum"
                role="img"
                aria-label="Espectro de frequência do microfone em tempo real"
                hidden={!stream || unavailable}
              />
              {(!stream || unavailable) && (
                <span className="voice-audio-hint">Microfone ativo</span>
              )}
              <span
                className="voice-recording-time"
                role="timer"
                aria-label="Tempo de gravação"
              >
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </span>
            </div>
          ) : (
            <p className="voice-audio-hint">
              {phase === "requesting"
                ? "Permita o uso do microfone."
                : phase === "transcribing"
                  ? "Estamos identificando o que você disse."
                  : "Toque no microfone para falar."}
            </p>
          )}
        </div>
        <motion.div
          className="voice-microphone-wrap"
          style={{ scale: reducedMotion ? 1 : scale }}
          whileTap={reducedMotion || pending ? undefined : { scale: 0.94 }}
        >
          {recording && !reducedMotion && (
            <motion.span
              className="voice-microphone-ring"
              aria-hidden="true"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.05, 0.3] }}
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
            />
          )}
          <Button
            type="button"
            className="voice-microphone-button"
            aria-label={label}
            disabled={pending}
            aria-busy={pending}
            onClick={recording ? onFinish : onStart}
          >
            {recording ? (
              <span className="voice-stop-icon" aria-hidden="true" />
            ) : pending ? (
              <span className="ui-button-spinner" aria-hidden="true" />
            ) : (
              <Image
                src="/icons/voice-help.svg"
                alt=""
                width={28}
                height={28}
                aria-hidden="true"
              />
            )}
          </Button>
        </motion.div>
      </div>
      {(recording || pending) && (
        <Button
          type="button"
          variant="ghost"
          className="voice-cancel-button"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      )}
    </section>
  );
}
