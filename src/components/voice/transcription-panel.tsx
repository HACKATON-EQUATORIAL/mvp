import { useId } from "react";
import type { SpeechPhase } from "@/hooks/use-speech-to-text";

export function TranscriptionPanel({
  phase,
  text,
}: {
  phase: SpeechPhase;
  text: string;
}) {
  const headingId = useId();
  return (
    <>
      <h4 className="transcript-heading" id={headingId}>
        Transcrição
      </h4>
      <div
        className={`transcript${text ? "" : " transcript-placeholder"}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-labelledby={headingId}
      >
        {phase === "transcribing"
          ? "Aguarde, estamos identificando o que você disse."
          : text || "O texto identificado aparece aqui."}
      </div>
    </>
  );
}
