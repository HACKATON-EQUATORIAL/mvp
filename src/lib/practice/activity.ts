import { useSyncExternalStore } from "react";

// Estado mínimo da prática em andamento, publicado pela tela de prática e lido
// pelo assistente (guard de interrupção e contexto). Sem gabarito.
export type PracticeActivity = {
  mode: "guided" | "independent";
  current: number;
  total: number;
  /** A pessoa já respondeu ou pediu ajuda nesta tentativa. */
  engaged: boolean;
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
