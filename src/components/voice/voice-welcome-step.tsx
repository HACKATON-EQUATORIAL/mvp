import { OtherOption } from "./voice-other-option";
import type { VoicePageContext } from "./voice-page-context";
import { VoiceChips, VoiceStep } from "./voice-step";

export const EXPLAIN_SCREEN = "explain-screen";
const PROBLEM = "report-problem";

/** Abertura: uma frase da tela, um atalho “Me explica” e as sugestões locais. */
export function VoiceWelcomeStep({
  context,
  inPractice,
  onSelectSuggestion,
  onExplain,
  onProblem,
  onReject,
}: {
  context: VoicePageContext;
  /** Há uma pergunta da prática na tela: o atalho vira “Me dá uma dica”. */
  inPractice: boolean;
  onSelectSuggestion: (id: string) => void;
  onExplain: () => void;
  /** Sem IA: abre a lista de dificuldades. */
  onProblem?: () => void;
  /** Com IA: “Nada disso” pede outras palavras por voz. */
  onReject?: () => void;
}) {
  return (
    <VoiceStep
      message={
        onReject
          ? inPractice
            ? "Travou? Fale comigo ou toque em uma opção."
            : "Oi! Fale comigo ou toque em uma opção."
          : inPractice
            ? "Travou? Toque em uma opção."
            : "Oi! Toque em uma opção."
      }
    >
      <VoiceChips
        options={[
          {
            id: EXPLAIN_SCREEN,
            label: inPractice ? "Me dá uma dica" : "Me explica esta tela",
          },
          ...context.suggestions.slice(0, 2),
          ...(onProblem ? [{ id: PROBLEM, label: "Estou com problema" }] : []),
        ]}
        onSelect={(id) =>
          id === EXPLAIN_SCREEN
            ? onExplain()
            : id === PROBLEM
              ? onProblem?.()
              : onSelectSuggestion(id)
        }
      />
      {onReject && <OtherOption onClick={onReject} />}
    </VoiceStep>
  );
}
