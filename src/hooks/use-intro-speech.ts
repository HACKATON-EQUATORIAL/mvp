"use client";

import { useEffect } from "react";
import { setMascotSpeech } from "@/lib/assistant/mascot-speech";

// Toques que não devem disparar a fala de abertura: link (leva a outra tela) e
// o próprio assistente (abrir o Eletriquinho já é outra conversa).
const IGNORE =
  "a, [data-sound-toggle], [data-assistant-trigger], .voice-drawer-popup";

/**
 * Fala de abertura do Eletriquinho numa tela: ao entrar, balão e voz juntos
 * (como na etapa 1), se o som estiver ligado; quem não quiser, muta pelo botão
 * do balão. Sem nenhuma interação antes na página (link direto, recarregar), o
 * navegador bloqueia o som: nada aparece até o primeiro clique ou tecla, e aí
 * balão e voz abrem juntos (sem balão mudo esperando). `click`/`keydown` porque
 * no celular o som só é liberado no fim do toque, não no `pointerdown`.
 */
export function useIntroSpeech(text: string) {
  useEffect(() => {
    const open = () => setMascotSpeech({ text, mood: "happy", speak: true });
    if (navigator.userActivation?.hasBeenActive !== false) {
      open();
      return () => setMascotSpeech(null);
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
      setMascotSpeech(null);
    };
  }, [text]);
}
