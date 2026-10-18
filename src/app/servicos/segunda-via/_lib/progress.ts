"use client";

import { useSyncExternalStore } from "react";
import { PARTS } from "./steps";

// Progresso didático só deste navegador (conveniência visual do serviço). A
// prova de realização é a tentativa enviada ao backend, nunca este registro.
export type JourneyProgress = {
  /** Etapa 1: viu a demonstração narrada. */
  demoDone: boolean;
  /** Etapa 2: partes concluídas (IDs das etapas da API). */
  partsDone: string[];
  /** Etapa 3: fez a conversa inteira sozinho. */
  fullDone: boolean;
  /** Alguma prática concluída sem nenhum erro. */
  perfect: boolean;
  /** Etapa 3 concluída sem pedir ajuda. */
  unassisted: boolean;
};

const KEY = "digitaliza:segunda-via:journey";
export const BADGE_EVENT = "digitaliza:badge";
const empty: JourneyProgress = {
  demoDone: false,
  partsDone: [],
  fullDone: false,
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

/** Só acrescenta: etapas e conquistas nunca são perdidas. */
export function updateProgress(change: Partial<JourneyProgress>) {
  const current = read();
  const next: JourneyProgress = {
    demoDone: current.demoDone || !!change.demoDone,
    partsDone: [
      ...new Set([...current.partsDone, ...(change.partsDone ?? [])]),
    ],
    fullDone: current.fullDone || !!change.fullDone,
    perfect: current.perfect || !!change.perfect,
    unassisted: current.unassisted || !!change.unassisted,
  };
  if (JSON.stringify(next) === JSON.stringify(current)) return;
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Sem armazenamento: o progresso vale só enquanto a página estiver aberta.
  }
  for (const listener of listeners) listener();
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

/** Energia (kWh de conhecimento) por etapa concluída: só visual. */
export const ENERGY = { demo: 10, part: 10, full: 40 };
export const ENERGY_MAX =
  ENERGY.demo + ENERGY.part * PARTS.length + ENERGY.full;

export function energyOf(progress: JourneyProgress) {
  return (
    (progress.demoDone ? ENERGY.demo : 0) +
    Math.min(progress.partsDone.length, PARTS.length) * ENERGY.part +
    (progress.fullDone ? ENERGY.full : 0)
  );
}

export type Badge = {
  id: string;
  label: string;
  detail: string;
  earned: boolean;
};

/** Selos do serviço, derivados do progresso (motivacionais, só no navegador). */
export function badgesOf(progress: JourneyProgress): Badge[] {
  const part = (id: string) => progress.partsDone.includes(id);
  return [
    {
      id: "vi",
      label: "Vi como funciona",
      detail: "Assistiu à demonstração da conversa com a Clara.",
      earned: progress.demoDone,
    },
    {
      id: "achei",
      label: "Achei a segunda via",
      detail: "Escolheu a opção certa no menu da Clara.",
      earned: part("encontrar-servico"),
    },
    {
      id: "seguro",
      label: "Documento seguro",
      detail: "Enviou só o CPF ou CNPJ, nunca senha.",
      earned: part("informar-documento"),
    },
    {
      id: "conferi",
      label: "Conferi a conta",
      detail: "Escolheu a fatura certa e conferiu antes de pagar.",
      earned: part("escolher-fatura") && part("conferir-resultado"),
    },
    {
      id: "sozinho",
      label: "Fiz sozinho",
      detail: "Fez a conversa inteira sem pedir ajuda.",
      earned: progress.unassisted,
    },
    {
      id: "perfeita",
      label: "Lição perfeita",
      detail: "Terminou uma prática sem errar.",
      earned: progress.perfect,
    },
  ];
}
