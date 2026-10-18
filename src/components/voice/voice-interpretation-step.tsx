import { LoaderCircle, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VoiceInterpretationState } from "@/hooks/use-voice-interpretation";
import type { VoiceAction } from "@/lib/assistant/journey";
import type { InterpretationRequest } from "@/lib/assistant/schemas";
import { OtherOption } from "./voice-other-option";
import { VoiceStep } from "./voice-step";

export function VoiceInterpretationStep({
  state,
  actions,
  catalog,
  onSelectSuggestion,
  onRetry,
  onCancel,
  onBack,
  onReject,
  onConfirm,
  canListen,
  speaking,
  onListen,
}: {
  state: VoiceInterpretationState;
  actions: VoiceAction[];
  catalog: InterpretationRequest["catalog"];
  onSelectSuggestion: (id: string) => void;
  onRetry: () => void;
  onCancel: () => void;
  onBack: () => void;
  onReject: () => void;
  onConfirm: (id: string) => void;
  canListen: boolean;
  speaking: boolean;
  onListen: () => void;
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
  const askedId =
    result.type === "confirmation_request" ? result.actionId : null;
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
      <div className="voice-reply">
        <p className="voice-step-description">{result.message}</p>
        {canListen && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="voice-listen-button"
            aria-label={speaking ? "Parar de ouvir" : "Ouvir resposta"}
            onClick={onListen}
          >
            {speaking ? (
              <Square
                size={18}
                fill="currentColor"
                strokeWidth={0}
                aria-hidden="true"
              />
            ) : (
              <Volume2 size={22} aria-hidden="true" />
            )}
          </Button>
        )}
      </div>
      <div className="voice-suggestions">
        {askedId && (
          <Button variant="primary" onClick={() => onConfirm(askedId)}>
            Sim
          </Button>
        )}
        {options.map((item) => (
          <Button
            key={item.id}
            variant="secondary"
            onClick={() => onSelectSuggestion(item.id)}
          >
            {item.label}
          </Button>
        ))}
        {askedId && (
          <Button variant="secondary" onClick={onBack}>
            Não, ver opções
          </Button>
        )}
        <OtherOption onClick={onReject} />
      </div>
    </section>
  );
}
