import { secondCopyTargets } from "@/app/servicos/segunda-via/_lib/voice-journey";
import type {
  VoicePageContext,
  VoicePageSuggestion,
} from "@/components/voice/voice-page-context";
import type { InterpretationRequest } from "./schemas";

export type VoiceTarget = {
  id: string;
  label: string;
  description: string;
  href: string;
};
export type VoiceAction = VoicePageSuggestion & { description: string };
export const homeTarget: VoiceAction = {
  id: "app.inicio",
  label: "Escolher um serviço",
  href: "/",
  description: "Início: escolher outro serviço para aprender.",
  confirmation: "Você quer voltar à escolha de serviços?",
};

export function buildVoiceActions(
  context: VoicePageContext,
  catalog: InterpretationRequest["catalog"],
): VoiceAction[] {
  const available = catalog.tracks.some(
    (track) => track.id === "segunda-via" && track.status === "available",
  );
  const actions: VoiceAction[] = [{ ...homeTarget }];
  if (available || catalog.state !== "ready")
    for (const target of secondCopyTargets)
      actions.push({
        ...target,
        confirmation: `Você quer abrir: ${target.label.toLocaleLowerCase("pt-BR")}?`,
      });
  // Sugestões da tela mantêm o rótulo local, mas usam o ID global da ação.
  for (const suggestion of context.suggestions) {
    const global = actions.find((item) => item.href === suggestion.href);
    if (global) Object.assign(global, suggestion, { id: global.id });
  }
  return actions;
}

export function localVoiceOptions(
  context: VoicePageContext,
  actions: VoiceAction[],
) {
  return context.suggestions
    .flatMap((suggestion) => {
      const action = actions.find((item) => item.href === suggestion.href);
      return action ? [action] : [];
    })
    .filter(
      (action, index, list) =>
        list.findIndex((item) => item.id === action.id) === index,
    )
    .slice(0, 3);
}
