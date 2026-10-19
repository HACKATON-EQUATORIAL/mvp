"use client";

import { useEffect } from "react";
import { setMascotSpeech } from "@/lib/assistant/mascot-speech";

/**
 * Fala de abertura do Eletriquinho numa tela: ao entrar, o balão aparece e a
 * voz toca (como na etapa 1), se o som estiver ligado; quem não quiser, muta
 * pelo botão do balão. Sem nenhum toque antes na página (link direto,
 * recarregar), o navegador bloqueia o som: o balão fica aberto e a voz sai no
 * primeiro toque que não seja num link (tocar num link leva a outra tela). O
 * botão de som do balão trata esse caso sozinho (ver o host).
 */
export function useIntroSpeech(text: string) {
  useEffect(() => {
    if (navigator.userActivation?.hasBeenActive !== false) {
      setMascotSpeech({ text, mood: "happy", speak: true });
      return () => setMascotSpeech(null);
    }
    setMascotSpeech({ text, mood: "happy", speak: false, waitTap: true });
    const onFirstTap = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest("a, [data-sound-toggle]"))
        return;
      document.removeEventListener("pointerdown", onFirstTap, true);
      setMascotSpeech({ text, mood: "happy", speak: true });
    };
    document.addEventListener("pointerdown", onFirstTap, true);
    return () => {
      document.removeEventListener("pointerdown", onFirstTap, true);
      setMascotSpeech(null);
    };
  }, [text]);
}
