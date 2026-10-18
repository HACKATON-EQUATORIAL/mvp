import { useSyncExternalStore } from "react";

// Estado vivo da lição em andamento (demonstração ou prática), publicado pela
// tela e lido pelo assistente: guard de interrupção e contexto da ajuda.
export type PracticeActivity = {
  mode: "demo" | "guided" | "independent";
  current: number;
  total: number;
  /** A pessoa já respondeu ou pediu ajuda nesta tentativa. */
  engaged: boolean;
  /** Título da parte/passo atual. */
  stepTitle?: string;
  /** O que a Clara diz agora (pergunta do item ou fala do passo). */
  prompt?: string;
  /** Dica do item (orienta sem dar a resposta). */
  hint?: string;
  /** Explicação curta da parte. */
  lesson?: string;
  /**
   * Rótulo da opção esperada: fica só no navegador para o host impedir que a
   * resposta apareça na fala do assistente. Nunca vai para a LLM.
   */
  expected?: string;
};

let activity: PracticeActivity | null = null;
const listeners = new Set<() => void>();

export function setPracticeActivity(next: PracticeActivity | null) {
  if (JSON.stringify(next) === JSON.stringify(activity)) return;
  activity = next;
  for (const listener of listeners) listener();
}

export function getPracticeActivity() {
  return activity;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePracticeActivity() {
  return useSyncExternalStore(subscribe, getPracticeActivity, () => null);
}

// O assistente avisa quando deu uma ajuda (dica/explicação) durante a prática:
// na etapa 3, isso marca a tentativa como “com apoio” (métrica de autonomia).
export const ASSISTANT_HELP_EVENT = "digitaliza:assistant-help";

export function notifyAssistantHelp() {
  window.dispatchEvent(new Event(ASSISTANT_HELP_EVENT));
}
