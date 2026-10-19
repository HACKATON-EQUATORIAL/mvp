"use client";

import { useEffect } from "react";
import { setMascotSpeech } from "@/lib/assistant/mascot-speech";

// Toques que não devem disparar a fala de abertura: link (leva a outra tela) e
// o próprio assistente (abrir o Eletriquinho já é outra conversa).
const IGNORE =
  "a, [data-sound-toggle], [data-assistant-trigger], .voice-drawer-popup";

// Aberturas já ditas nesta sessão (sessionStorage): navegar e voltar não repete.
// Recarregar (F5) conta como sessão nova: as marcas são apagadas uma vez, ao
// carregar o site.
const PREFIX = "digitaliza:fala:";
let checkedReload = false;
function resetOnReload() {
  if (checkedReload) return;
  checkedReload = true;
  const navigation = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (navigation?.type !== "reload") return;
  try {
    for (const name of Object.keys(sessionStorage))
      if (name.startsWith(PREFIX)) sessionStorage.removeItem(name);
  } catch {
    // Sem armazenamento: nada a apagar.
  }
}
function wasSpoken(key: string) {
  try {
    return sessionStorage.getItem(PREFIX + key) === "1";
  } catch {
    return false;
  }
}
function markSpoken(key: string) {
  try {
    sessionStorage.setItem(PREFIX + key, "1");
  } catch {
    // Sem armazenamento: pode repetir.
  }
}

/**
 * Fala de abertura do Eletriquinho numa tela (`key`): balão e voz juntos, uma
 * vez por sessão (F5 conta como nova), se o som estiver ligado; quem não quiser, muta
 * pelo botão do balão. Sem nenhuma interação antes na página (link direto,
 * recarregar), o navegador bloqueia o som: nada aparece até o primeiro clique
 * ou tecla, e aí balão e voz abrem juntos. `click`/`keydown` porque no celular
 * o som só é liberado no fim do toque, não no `pointerdown`.
 */
export function useIntroSpeech(text: string, key: string) {
  useEffect(() => {
    resetOnReload();
    // A tela pode voltar a aparecer (o Next mantém telas visitadas montadas):
    // a marca é conferida a cada exibição.
    if (wasSpoken(key)) return;
    // Marca logo depois de abrir: a desmontagem imediata do Strict Mode (dev)
    // cancela o timer, e a remontagem fala de novo em vez de ficar muda.
    let mark: ReturnType<typeof setTimeout> | undefined;
    const open = () => {
      setMascotSpeech({ text, mood: "happy", speak: true });
      mark = setTimeout(() => markSpoken(key), 0);
    };
    if (navigator.userActivation?.hasBeenActive !== false) {
      open();
      return () => {
        clearTimeout(mark);
        setMascotSpeech(null);
      };
    }
    const onFirst = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") return;
      if ((event.target as Element | null)?.closest?.(IGNORE)) return;
      stop();
      open();
    };
    const stop = () => {
      document.removeEventListener("click", onFirst, true);
      document.removeEventListener("keydown", onFirst, true);
    };
    document.addEventListener("click", onFirst, true);
    document.addEventListener("keydown", onFirst, true);
    return () => {
      stop();
      clearTimeout(mark);
      setMascotSpeech(null);
    };
  }, [text, key]);
}
