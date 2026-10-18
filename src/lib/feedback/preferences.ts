import { useSyncExternalStore } from "react";

// Preferência única de som: voz do assistente e efeitos da prática. Guardada
// só neste navegador (conveniência); vale ligado por padrão.
const KEY = "digitaliza:sound";
let enabled: boolean | null = null;
const listeners = new Set<() => void>();

export function getSoundEnabled() {
  if (enabled !== null) return enabled;
  try {
    enabled = localStorage.getItem(KEY) !== "off";
  } catch {
    enabled = true;
  }
  return enabled;
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  try {
    localStorage.setItem(KEY, next ? "on" : "off");
  } catch {
    // Sem armazenamento: vale até recarregar.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSoundEnabled() {
  return useSyncExternalStore(subscribe, getSoundEnabled, () => true);
}
