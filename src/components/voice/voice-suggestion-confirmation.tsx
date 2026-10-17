import { Button } from "@/components/ui/button";
import type { VoicePageSuggestion } from "./voice-page-context";
import { VoiceStep } from "./voice-step";

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
    <VoiceStep title="Confirmar escolha" description={suggestion.confirmation}>
      <Button type="button" variant="primary" onClick={onContinue}>
        Continuar
      </Button>
      <Button type="button" variant="secondary" onClick={onBack}>
        Voltar às opções
      </Button>
    </VoiceStep>
  );
}
