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
  /** Alguma prática concluída sem nenhum erro. */
  perfect: boolean;
  /** Prática individual concluída sem pedir ajuda. */
  unassisted: boolean;
};

const KEY = "digitaliza:segunda-via:progress";
export const BADGE_EVENT = "digitaliza:badge";
const empty: JourneyProgress = {
  learned: [],
  guidedDone: false,
  independentDone: false,
  simulated: [],
  perfect: false,
  unassisted: false,
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
  // Conquistas só se ganham, nunca se perdem.
  next.perfect = current.perfect || !!change.perfect;
  next.unassisted = current.unassisted || !!change.unassisted;
  if (JSON.stringify(next) === JSON.stringify(current)) return;
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Sem armazenamento: o progresso vale só enquanto a página estiver aberta.
  }
  for (const listener of listeners) listener();
  // Selos recém-desbloqueados também são celebrados.
  const before = new Set(
    badgesOf(current)
      .filter((b) => b.earned)
      .map((b) => b.id),
  );
  for (const badge of badgesOf(next))
    if (badge.earned && !before.has(badge.id))
      window.dispatchEvent(
        new CustomEvent(BADGE_EVENT, {
          detail: { id: badge.id, label: badge.label },
        }),
      );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useJourneyProgress() {
  return useSyncExternalStore(subscribe, read, () => empty);
}

/** Pontos de energia (kWh de conhecimento) por passo concluído: só visual. */
export const ENERGY = {
  lesson: 10,
  guided: 20,
  independent: 30,
  simulated: 20,
};
export const ENERGY_MAX =
  ENERGY.lesson * 2 + ENERGY.guided + ENERGY.independent + ENERGY.simulated;

export function energyOf(progress: JourneyProgress) {
  return (
    progress.learned.length * ENERGY.lesson +
    (progress.guidedDone ? ENERGY.guided : 0) +
    (progress.independentDone ? ENERGY.independent : 0) +
    (progress.simulated.length ? ENERGY.simulated : 0)
  );
}

export type Badge = {
  id: string;
  label: string;
  detail: string;
  earned: boolean;
};

/** Selos da trilha, derivados do progresso (motivacionais, só no navegador). */
export function badgesOf(progress: JourneyProgress): Badge[] {
  return [
    {
      id: "achei",
      label: "Achei a segunda via",
      detail: "Concluiu a lição de encontrar o serviço.",
      earned: progress.learned.includes("encontrar"),
    },
    {
      id: "conferi",
      label: "Conferi a conta",
      detail: "Concluiu a lição de conferir a conta.",
      earned: progress.learned.includes("conferir"),
    },
    {
      id: "perfeita",
      label: "Lição perfeita",
      detail: "Terminou uma prática sem errar.",
      earned: progress.perfect,
    },
    {
      id: "sozinho",
      label: "Sem ajuda",
      detail: "Fez a prática individual sem pedir ajuda.",
      earned: progress.unassisted,
    },
    {
      id: "canal",
      label: "Treinei no canal",
      detail: "Concluiu um simulador do atendimento digital.",
      earned: progress.simulated.length > 0,
    },
  ];
}
