import type { SpeechPhase } from "@/hooks/use-speech-to-text";

export function TranscriptionPanel({
  phase,
  text,
}: {
  phase: SpeechPhase;
  text: string;
}) {
  return (
    <>
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
    </>
  );
}
