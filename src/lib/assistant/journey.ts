import {
  type NavigationContext,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
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
  contextPrefix: string;
  origin: NavigationContext["origem"];
  step?: NavigationContext["etapa"];
};
export type VoiceAction = VoicePageSuggestion & { description: string };
export const homeTarget: VoiceAction = {
  id: "app.inicio",
  label: "Escolher uma trilha",
  href: "/",
  description: "Início: escolher outra trilha de aprendizagem.",
  confirmation: "Você quer voltar à escolha de trilhas?",
};
export function buildVoiceActions(
  context: VoicePageContext,
  catalog: InterpretationRequest["catalog"],
): VoiceAction[] {
  const source = secondCopyTargets.find(
    (target) =>
      context.id === target.contextPrefix ||
      context.id.startsWith(`${target.contextPrefix}.`),
  );
  const navigation = {
    origem: context.id === "home-tracks" ? ("inicio" as const) : source?.origin,
    etapa: source?.step,
    ...context.navigation,
  };
  const available = catalog.tracks.some(
    (track) => track.id === "segunda-via" && track.status === "available",
  );
  const actions: VoiceAction[] = [{ ...homeTarget }];
  if (available && catalog.secondCopy) {
    for (const target of secondCopyTargets) {
      actions.push({
        id: target.id,
        label: target.label,
        description: target.description,
        href: withContext(target.href, navigation),
        confirmation: `Você quer abrir: ${target.label.toLocaleLowerCase("pt-BR")}?${target.id === "segunda-via.pratica-concluida" ? " Isso não registra a realização do treino." : ""}`,
      });
    }
  }
  // Local suggestions retain contextual labels and return parameters; unavailable journeys never enter the map.
  for (const suggestion of context.suggestions) {
    const path = suggestion.href.split("?")[0];
    const target =
      path === "/"
        ? homeTarget
        : secondCopyTargets.find((item) => item.href === path);
    const global = target && actions.find((item) => item.id === target.id);
    if (global) Object.assign(global, suggestion, { id: global.id });
    else if (
      target &&
      catalog.state !== "ready" &&
      !catalog.tracks.some(
        (track) => track.id === "segunda-via" && track.status === "coming_soon",
      )
    ) {
      actions.push({
        ...suggestion,
        id: target.id,
        description: target.description,
      });
    }
  }
  return actions;
}
export function localVoiceOptions(
  context: VoicePageContext,
  actions: VoiceAction[],
) {
  return context.suggestions
    .flatMap((suggestion) => {
      const action = actions.find(
        (item) =>
          item.href === suggestion.href ||
          item.href.split("?")[0] === suggestion.href.split("?")[0],
      );
      return action ? [action] : [];
    })
    .filter(
      (action, index, list) =>
        list.findIndex((item) => item.id === action.id) === index,
    )
    .slice(0, 3);
}
