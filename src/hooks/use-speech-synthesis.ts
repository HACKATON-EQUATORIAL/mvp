"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LANG = "pt-BR";
const VOICES_TIMEOUT_MS = 1500;

/** Só vozes em português: pt-BR local, pt-BR, depois qualquer pt-*. Nunca a padrão. */
function pickVoice(voices: SpeechSynthesisVoice[]) {
  const lang = (voice: SpeechSynthesisVoice) =>
    voice.lang.replace("_", "-").toLowerCase();
  const brazilian = voices.filter((voice) => lang(voice) === "pt-br");
  const portuguese = voices.filter((voice) => lang(voice).startsWith("pt"));
  const pool = brazilian.length ? brazilian : portuguese;
  return pool.find((voice) => voice.localService) ?? pool[0] ?? null;
}

/** Vozes do navegador; no Chrome chegam de forma assíncrona. */
function loadVoices(synth: SpeechSynthesis) {
  const now = synth.getVoices();
  if (now.length) return Promise.resolve(now);
  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const done = () => {
      synth.removeEventListener("voiceschanged", done);
      clearTimeout(timer);
      resolve(synth.getVoices());
    };
    const timer = setTimeout(done, VOICES_TIMEOUT_MS);
    synth.addEventListener("voiceschanged", done);
  });
}

/**
 * Fala textos com a API nativa do navegador, sempre em português. Sem voz pt
 * instalada, não fala (o texto continua na tela) em vez de usar uma voz em inglês.
 */
export function useSpeechSynthesis() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const current = useRef<SpeechSynthesisUtterance | null>(null);
  const request = useRef(0);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    let alive = true;
    const check = () => {
      if (alive) setSupported(!!pickVoice(synth.getVoices()));
    };
    void loadVoices(synth).then(check);
    synth.addEventListener("voiceschanged", check);
    return () => {
      alive = false;
      synth.removeEventListener("voiceschanged", check);
      synth.cancel();
    };
  }, []);

  const cancel = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    request.current += 1;
    current.current = null;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  // iOS só libera a fala depois de uma chamada feita em um gesto do usuário.
  // Chamar isto no toque do microfone destrava as respostas assíncronas.
  const prime = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(" ");
    utterance.lang = LANG;
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback((text: string) => {
    const message = text.trim();
    if (!message || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const id = ++request.current;
    void loadVoices(synth).then((voices) => {
      // Outra fala ou um cancelamento chegou enquanto as vozes carregavam.
      if (id !== request.current) return;
      const voice = pickVoice(voices);
      if (!voice) {
        setSupported(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = LANG;
      utterance.voice = voice;
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
    });
  }, []);

  return { supported, speaking, speak, cancel, prime };
}
