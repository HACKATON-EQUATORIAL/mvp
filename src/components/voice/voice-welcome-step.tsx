import { OtherOption } from "./voice-other-option";
import type { VoicePageContext } from "./voice-page-context";
import { VoiceChips, VoiceStep } from "./voice-step";

export const EXPLAIN_SCREEN = "explain-screen";

/** Abertura: uma frase da tela, um atalho “Me explica” e as sugestões locais. */
export function VoiceWelcomeStep({
  context,
  inPractice,
  onSelectSuggestion,
  onExplain,
  onReject,
}: {
  context: VoicePageContext;
  /** Há uma pergunta da prática na tela: o atalho vira “Me dá uma dica”. */
  inPractice: boolean;
  onSelectSuggestion: (id: string) => void;
  onExplain: () => void;
  onReject: () => void;
}) {
  return (
    <VoiceStep
      message={
        inPractice
          ? "Travou? Fale comigo ou toque em uma opção."
          : "Oi! Fale comigo ou toque em uma opção."
      }
    >
      <VoiceChips
        options={[
          {
            id: EXPLAIN_SCREEN,
            label: inPractice ? "Me dá uma dica" : "Me explica esta tela",
          },
          ...context.suggestions.slice(0, 2),
        ]}
        onSelect={(id) =>
          id === EXPLAIN_SCREEN ? onExplain() : onSelectSuggestion(id)
        }
      />
      <OtherOption onClick={onReject} />
    </VoiceStep>
  );
}
