import type { VoicePageSuggestion } from "./voice-page-context";
import { VoiceStep, VoiceYesNo } from "./voice-step";

/** Confirma uma saída que interrompe a prática em andamento. */
export function VoiceSuggestionConfirmation({
  suggestion,
  onContinue,
  onBack,
}: {
  suggestion: VoicePageSuggestion;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <VoiceStep message={suggestion.confirmation}>
      <VoiceYesNo
        yes="Sim, ir"
        no="Ficar aqui"
        onYes={onContinue}
        onNo={onBack}
      />
    </VoiceStep>
  );
}
