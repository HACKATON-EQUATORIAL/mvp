"use client";

import { useSyncExternalStore } from "react";

// IDs das perguntas que a pessoa errou (nunca as respostas). Alimentam a
// revisão, que pede ao backend uma tentativa só com esses itens.
const KEY = "digitaliza:segunda-via:missed";
let cache: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    cache = [];
  }
  return cache ?? [];
}

function write(next: string[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Sem armazenamento: a revisão vale até recarregar.
  }
  for (const listener of listeners) listener();
}

/** Leitura direta (no cliente), para fixar a lista ao abrir a revisão. */
export function readMissed() {
  return [...read()];
}

export function addMissed(itemId: string) {
  if (!read().includes(itemId)) write([...read(), itemId]);
}

/** Remove da revisão as perguntas acertadas de primeira. */
export function clearMissed(itemIds: string[]) {
  const next = read().filter((id) => !itemIds.includes(id));
  if (next.length !== read().length) write(next);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const empty: string[] = [];
export function useMissedItems() {
  return useSyncExternalStore(subscribe, read, () => empty);
}
