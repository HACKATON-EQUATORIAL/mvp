import { useSyncExternalStore } from "react";
import type { EletriquinhoMood } from "@/components/brand/eletriquinho";

// Fala do Eletriquinho no balão do canto (narração da demonstração, avisos).
// Tem prioridade sobre a dica fixa da tela (`VoicePageContext.tip`).
export type MascotSpeech = { text: string; mood?: EletriquinhoMood } | null;

let speech: MascotSpeech = null;
const listeners = new Set<() => void>();

export function setMascotSpeech(next: MascotSpeech) {
  if (next?.text === speech?.text && next?.mood === speech?.mood) return;
  speech = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMascotSpeech() {
  return useSyncExternalStore(
    subscribe,
    () => speech,
    () => null,
  );
}
