"use client";

import { useSyncExternalStore } from "react";
import type { Step } from "./navigation";

// Progresso didático só deste navegador (conveniência visual da trilha). A
// prova de realização é a tentativa no backend, nunca este registro.
export type JourneyProgress = {
  learned: Step[];
  guidedDone: boolean;
  independentDone: boolean;
  /** Simulações de canal concluídas (IDs da API). */
  simulated: string[];
};

const KEY = "digitaliza:segunda-via:progress";
const empty: JourneyProgress = {
  learned: [],
  guidedDone: false,
  independentDone: false,
  simulated: [],
};
let cache: JourneyProgress | null = null;
const listeners = new Set<() => void>();

function read(): JourneyProgress {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    cache = empty;
  }
  return cache as JourneyProgress;
}

export function updateProgress(change: Partial<JourneyProgress>) {
  const current = read();
  const next = {
    ...current,
    ...change,
    learned: [...new Set([...current.learned, ...(change.learned ?? [])])],
    simulated: [
      ...new Set([...current.simulated, ...(change.simulated ?? [])]),
    ],
  };
  if (JSON.stringify(next) === JSON.stringify(current)) return;
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Sem armazenamento: o progresso vale só enquanto a página estiver aberta.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useJourneyProgress() {
  return useSyncExternalStore(subscribe, read, () => empty);
}
