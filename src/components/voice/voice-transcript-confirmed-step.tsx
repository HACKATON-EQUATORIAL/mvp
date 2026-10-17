import { Button } from "@/components/ui/button";
import type { VoicePageContext } from "./voice-page-context";
import { VoiceStep } from "./voice-step";

export function VoiceTranscriptConfirmedStep({
  text,
  context,
  onSelectSuggestion,
}: {
  text: string;
  context: VoicePageContext;
  onSelectSuggestion: (id: string) => void;
}) {
  return (
    <VoiceStep
      title="Transcrição confirmada"
      description="Escolha uma opção disponível nesta tela. O pedido ainda não foi interpretado automaticamente."
    >
      <blockquote className="voice-confirmed-text">{text}</blockquote>
      <div className="voice-suggestions">
        {context.suggestions.map((suggestion) => (
          <Button
            key={suggestion.id}
            type="button"
            variant="secondary"
            onClick={() => onSelectSuggestion(suggestion.id)}
          >
            {suggestion.label}
          </Button>
        ))}
      </div>
    </VoiceStep>
  );
}
