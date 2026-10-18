import { Button } from "@/components/ui/button";
import type { VoicePageSuggestion } from "./voice-page-context";
import { VoiceStep } from "./voice-step";

export function VoiceSuggestionConfirmation({
  title = "Confirmar escolha",
  suggestion,
  confirmLabel = "Continuar",
  backLabel = "Voltar às opções",
  alternatives = [],
  onContinue,
  onSelectAlternative,
  onBack,
}: {
  title?: string;
  suggestion: VoicePageSuggestion;
  confirmLabel?: string;
  backLabel?: string;
  alternatives?: VoicePageSuggestion[];
  onContinue: () => void;
  onSelectAlternative?: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <VoiceStep title={title} description={suggestion.confirmation}>
      <Button type="button" variant="primary" onClick={onContinue}>
        {confirmLabel}
      </Button>
      {onSelectAlternative &&
        alternatives.slice(0, 2).map((item) => (
          <Button
            key={item.id}
            type="button"
            variant="secondary"
            onClick={() => onSelectAlternative(item.id)}
          >
            {item.label}
          </Button>
        ))}
      <Button type="button" variant="secondary" onClick={onBack}>
        {backLabel}
      </Button>
    </VoiceStep>
  );
}
