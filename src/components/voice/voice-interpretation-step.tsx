import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VoiceInterpretationState } from "@/hooks/use-voice-interpretation";
import type { VoiceAction } from "@/lib/assistant/journey";
import type { InterpretationRequest } from "@/lib/assistant/schemas";
import { VoiceStep } from "./voice-step";

export function VoiceInterpretationStep({
  state,
  actions,
  catalog,
  onSelectSuggestion,
  onRetry,
  onCancel,
  onBack,
}: {
  state: VoiceInterpretationState;
  actions: VoiceAction[];
  catalog: InterpretationRequest["catalog"];
  onSelectSuggestion: (id: string) => void;
  onRetry: () => void;
  onCancel: () => void;
  onBack: () => void;
}) {
  if (state.status === "pending")
    return (
      <VoiceStep
        title="Entendendo seu pedido…"
        description="Estou consultando os caminhos disponíveis."
      >
        <p role="status">
          <LoaderCircle
            className="ui-button-spinner motion-reduce:animate-none"
            aria-hidden="true"
          />{" "}
          Interpretando sua mensagem
        </p>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar interpretação
        </Button>
      </VoiceStep>
    );
  if (state.status !== "success")
    return (
      <VoiceStep
        title="Não consegui interpretar o pedido"
        description={
          state.status === "error"
            ? state.message
            : "Tente novamente ou escolha uma opção."
        }
      >
        <Button onClick={onRetry}>Tentar novamente</Button>
        <Button variant="secondary" onClick={onBack}>
          Ver opções da tela
        </Button>
      </VoiceStep>
    );
  const result = state.result;
  const options = result.showCatalog
    ? catalog.tracks.flatMap((track) => {
        const action = actions.find(
          (item) => item.id === `${track.id}.preparacao`,
        );
        return track.status === "available" && action
          ? [{ ...action, label: track.title }]
          : [];
      })
    : result.optionIds.flatMap((id) => {
        const action = actions.find((item) => item.id === id);
        return action ? [action] : [];
      });
  return (
    <section className="voice-step" aria-label="Resposta do assistente">
      <p className="voice-step-description">{result.message}</p>
      {options.length > 0 && (
        <div className="voice-suggestions">
          {options.map((item) => (
            <Button
              key={item.id}
              variant="secondary"
              onClick={() => onSelectSuggestion(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}
