"use client";

import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { RecordingControls } from "./recording-controls";
import { TranscriptionPanel } from "./transcription-panel";

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
      <RecordingControls
        phase={phase}
        seconds={seconds}
        pending={pending}
        canRetry={canRetry}
        onStart={startRecording}
        onFinish={finishRecording}
        onCancel={cancel}
        onRetry={retry}
      />
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <TranscriptionPanel phase={phase} text={text} />
    </section>
  );
}
