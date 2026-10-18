"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LANG = "pt-BR";

function pickVoice(voices: SpeechSynthesisVoice[]) {
  const exact = voices.filter((voice) => voice.lang.replace("_", "-") === LANG);
  const portuguese = voices.filter((voice) => voice.lang.startsWith("pt"));
  const pool = exact.length ? exact : portuguese;
  return pool.find((voice) => voice.localService) ?? pool[0] ?? null;
}

/**
 * Fala textos com a API nativa do navegador (sem chave, rota ou cota).
 * A qualidade da voz depende do aparelho; sem voz pt-BR instalada, o
 * navegador usa a voz padrão com `lang` pt-BR.
 */
export function useSpeechSynthesis() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const current = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const loadVoice = () => {
      voice.current = pickVoice(synth.getVoices());
    };
    loadVoice();
    setSupported(true);
    // Chrome carrega as vozes de forma assíncrona.
    synth.addEventListener("voiceschanged", loadVoice);
    return () => {
      synth.removeEventListener("voiceschanged", loadVoice);
      synth.cancel();
    };
  }, []);

  const cancel = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    current.current = null;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  // iOS só libera a fala depois de uma chamada feita em um gesto do usuário.
  // Chamar isto no toque do microfone destrava as respostas assíncronas.
  const prime = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(" ");
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback((text: string) => {
    const message = text.trim();
    if (!message || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = LANG;
    if (voice.current) utterance.voice = voice.current;
    const finish = () => {
      if (current.current !== utterance) return;
      current.current = null;
      setSpeaking(false);
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    current.current = utterance;
    setSpeaking(true);
    synth.speak(utterance);
  }, []);

  return { supported, speaking, speak, cancel, prime };
}
