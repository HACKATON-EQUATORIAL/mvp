"use client";

import { useEffect, useRef, useState } from "react";

/** Observes the recorder's stream; never requests or stops microphone tracks. */
export function useAudioSpectrum({
  stream,
  reducedMotion,
  onLevel,
}: {
  stream: MediaStream | null;
  reducedMotion: boolean;
  onLevel: (level: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    setUnavailable(false);
    onLevel(0);
    const canvas = canvasRef.current;
    if (!stream || !canvas) return;
    if (typeof AudioContext === "undefined") {
      setUnavailable(true);
      return;
    }

    let context: AudioContext | undefined;
    let source: MediaStreamAudioSourceNode | undefined;
    let analyser: AnalyserNode | undefined;
    let observer: ResizeObserver | undefined;
    let frame = 0;
    let disposed = false;
    let lastDraw = 0;
    const cleanup = () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      source?.disconnect();
      analyser?.disconnect();
      if (context && context.state !== "closed")
        void context.close().catch(() => {});
      onLevel(0);
    };

    try {
      context = new AudioContext();
      source = context.createMediaStreamSource(stream);
      analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      const node = analyser;
      const frequency = new Uint8Array(node.frequencyBinCount);
      const waveform = new Uint8Array(node.fftSize);
      const drawing = canvas.getContext("2d");
      if (!drawing) throw new Error("Canvas unavailable");
      const color = getComputedStyle(canvas).color;
      const resize = () => {
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas.clientWidth * scale);
        canvas.height = Math.round(canvas.clientHeight * scale);
      };
      observer = new ResizeObserver(resize);
      observer.observe(canvas);
      resize();

      const draw = (now: number) => {
        if (disposed) return;
        frame = requestAnimationFrame(draw);
        if (now - lastDraw < 1000 / (reducedMotion ? 12 : 30)) return;
        lastDraw = now;
        node.getByteFrequencyData(frequency);
        node.getByteTimeDomainData(waveform);
        const rms = Math.sqrt(
          waveform.reduce((sum, value) => sum + ((value - 128) / 128) ** 2, 0) /
            waveform.length,
        );
        onLevel(Math.min(1, rms * 5));
        drawing.clearRect(0, 0, canvas.width, canvas.height);
        drawing.fillStyle = color;
        const bars = 28;
        const gap = canvas.width / bars;
        // Logarithmic frequency bands from 80 Hz to 8 kHz (limited by Nyquist).
        const maxFrequency = Math.min(8000, node.context.sampleRate / 2);
        for (let i = 0; i < bars; i++) {
          const start = Math.max(
            1,
            Math.floor(
              (80 * (maxFrequency / 80) ** (i / bars) * node.fftSize) /
                node.context.sampleRate,
            ),
          );
          const end = Math.min(
            frequency.length,
            Math.max(
              start + 1,
              Math.ceil(
                (80 * (maxFrequency / 80) ** ((i + 1) / bars) * node.fftSize) /
                  node.context.sampleRate,
              ),
            ),
          );
          let sum = 0;
          for (let bin = start; bin < end; bin++) sum += frequency[bin];
          const height = Math.max(
            2,
            (sum / (end - start) / 255) * canvas.height,
          );
          drawing.beginPath();
          drawing.roundRect(
            i * gap,
            (canvas.height - height) / 2,
            Math.max(1, gap * 0.5),
            height,
            gap / 4,
          );
          drawing.fill();
        }
      };
      void context
        .resume()
        .then(() => {
          if (!disposed) frame = requestAnimationFrame(draw);
        })
        .catch(() => {
          if (disposed) return;
          cleanup();
          setUnavailable(true);
        });
    } catch {
      cleanup();
      setUnavailable(true);
    }

    return () => {
      disposed = true;
      cleanup();
    };
  }, [stream, reducedMotion, onLevel]);

  return { canvasRef, unavailable };
}
