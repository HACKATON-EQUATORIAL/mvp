import { LoaderCircle, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VoiceInterpretationState } from "@/hooks/use-voice-interpretation";
import type { VoiceAction } from "@/lib/assistant/journey";
import type { InterpretationRequest } from "@/lib/assistant/schemas";
import { OtherOption } from "./voice-other-option";
import { VoiceChips, VoiceStep, VoiceYesNo } from "./voice-step";

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
        message="Pensando…"
        action={
          <LoaderCircle
            className="ui-button-spinner motion-reduce:animate-none"
            aria-hidden="true"
          />
        }
      >
        <button type="button" className="voice-link" onClick={onCancel}>
          Cancelar
        </button>
      </VoiceStep>
    );
  if (state.status !== "success")
    return (
      <VoiceStep
        tone="error"
        message={
          state.status === "error"
            ? state.message
            : "Não entendi. Tente de novo ou escolha uma opção."
        }
      >
        <VoiceChips
          options={[
            { id: "retry", label: "Tentar de novo" },
            { id: "back", label: "Ver opções" },
          ]}
          onSelect={(id) => (id === "retry" ? onRetry() : onBack())}
        />
      </VoiceStep>
    );
  const result = state.result;
  const askedId =
    result.type === "confirmation_request" ? result.actionId : null;
  const options = result.showCatalog
    ? catalog.tracks.flatMap((track) => {
        const action = actions.find((item) => item.id === `${track.id}.canal`);
        return track.status === "available" && action
          ? [{ id: action.id, label: track.title }]
          : [];
      })
    : result.optionIds.flatMap((id) => {
        const action = actions.find((item) => item.id === id);
        return action ? [{ id: action.id, label: action.label }] : [];
      });
  return (
    <VoiceStep
      message={result.message}
      action={
        canListen && (
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
                size={16}
                fill="currentColor"
                strokeWidth={0}
                aria-hidden="true"
              />
            ) : (
              <Volume2 size={20} aria-hidden="true" />
            )}
          </Button>
        )
      }
    >
      {askedId && <VoiceYesNo onYes={() => onConfirm(askedId)} onNo={onBack} />}
      <VoiceChips options={options} onSelect={onSelectSuggestion} />
      <OtherOption onClick={onReject} />
    </VoiceStep>
  );
}
