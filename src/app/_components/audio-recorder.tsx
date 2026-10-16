"use client";

import { useSpeechToText } from "@/app/_hooks/use-speech-to-text";

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
      <button
        type="button"
        className="primary-button"
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
      </button>
      {(phase === "recording" || pending) && (
        <button type="button" className="secondary-button" onClick={cancel}>
          Cancelar
        </button>
      )}
      {canRetry && (
        <button type="button" className="secondary-button" onClick={retry}>
          Tentar enviar novamente
        </button>
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
