import type { SpeechPhase } from "@/hooks/use-speech-to-text";
import { VoiceChips, VoiceStep } from "./voice-step";

/** Estado da captura de voz em uma linha; os controles ficam no compositor. */
export function AudioRecorder({
  phase,
  error,
  canRetry,
  onBack,
  onRetry,
  rephrase = false,
}: {
  phase: SpeechPhase;
  error: string;
  canRetry: boolean;
  onBack: () => void;
  onRetry: () => void;
  rephrase?: boolean;
}) {
  if (error)
    return (
      <VoiceStep message={error} tone="error">
        <VoiceChips
          options={[
            ...(canRetry ? [{ id: "retry", label: "Enviar de novo" }] : []),
            { id: "back", label: "Voltar" },
          ]}
          onSelect={(id) => (id === "retry" ? onRetry() : onBack())}
        />
      </VoiceStep>
    );
  return (
    <VoiceStep
      message={
        phase === "requesting"
          ? "Permita o microfone para falar comigo."
          : phase === "recording"
            ? rephrase
              ? "Diga com outras palavras. Estou ouvindo…"
              : "Estou ouvindo…"
            : phase === "transcribing"
              ? "Entendendo o que você disse…"
              : "A gravação parou."
      }
    >
      {phase !== "recording" &&
        phase !== "requesting" &&
        phase !== "transcribing" && (
          <VoiceChips
            options={[{ id: "back", label: "Voltar" }]}
            onSelect={onBack}
          />
        )}
    </VoiceStep>
  );
}
