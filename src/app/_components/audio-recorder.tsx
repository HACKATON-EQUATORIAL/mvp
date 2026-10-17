"use client";

import { useSpeechToText } from "@/app/_hooks/use-speech-to-text";
import { Button } from "@/components/ui/button";

export function AudioRecorder() {
  const {
    phase,
    seconds,
    text,
    error,
    canRetry,
    pending,
    startRecording,
    finishRecording,
    cancel,
    retry,
  } = useSpeechToText();
  return (
    <section
      className="recorder"
      aria-labelledby="recorder-heading"
      aria-busy={phase === "transcribing"}
    >
      <h2 id="recorder-heading">Grave seu pedido</h2>
      <p className="recorder-hint">
        Até 1 minuto de áudio, convertido em texto.
      </p>
      {phase === "recording" && (
        <p className="recording-status" role="status">
          <span className="recording-dot" aria-hidden="true" />
          Gravando · {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </p>
      )}
      <Button
        type="button"
        variant="primary"
        size="recording"
        disabled={pending}
        onClick={phase === "recording" ? finishRecording : startRecording}
      >
        {phase === "recording"
          ? "Parar e transcrever"
          : phase === "requesting"
            ? "Aguardando microfone…"
            : phase === "transcribing"
              ? "Transcrevendo…"
              : phase === "success" || phase === "error"
                ? "Gravar novamente"
                : "Gravar áudio"}
      </Button>
      {(phase === "recording" || pending) && (
        <Button
          type="button"
          variant="secondary"
          size="recording-secondary"
          onClick={cancel}
        >
          Cancelar
        </Button>
      )}
      {canRetry && (
        <Button
          type="button"
          variant="secondary"
          size="recording-secondary"
          onClick={retry}
        >
          Tentar enviar novamente
        </Button>
      )}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <h2 className="transcript-heading" id="transcript-heading">
        Transcrição
      </h2>
      <div
        className={`transcript${text ? "" : " transcript-placeholder"}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-labelledby="transcript-heading"
      >
        {phase === "transcribing"
          ? "Aguarde, estamos identificando o que você disse."
          : text || "O texto identificado aparece aqui."}
      </div>
    </section>
  );
}
