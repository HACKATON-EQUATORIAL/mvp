import { Button } from "@/components/ui/button";
import { OtherOption } from "./voice-other-option";
import type { VoicePageContext } from "./voice-page-context";
import { VoiceStep } from "./voice-step";

export function VoiceWelcomeStep({
  context,
  onSelectSuggestion,
  onReject,
}: {
  context: VoicePageContext;
  onSelectSuggestion: (id: string) => void;
  onReject: () => void;
}) {
  return (
    <VoiceStep title="Como posso ajudar?" description={context.description}>
      <p className="voice-suggestions-label">Você também pode escolher:</p>
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
        <OtherOption onClick={onReject} />
      </div>
    </VoiceStep>
  );
}
