"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { elevenLabsTtsEnabled } from "@/config/tts";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import {
  MAX_TTS_CHARS,
  STATIC_VOICE_PATH,
  TTS_PATH,
  TTS_WARM_PARAM,
  ttsUrl,
} from "@/lib/tts/constants";
import { phraseKey } from "@/lib/tts/phrase-key";
import manifest from "@/lib/tts/voice-manifest.json";

// WAV silencioso: tocado no gesto do usuário para destravar o áudio no iOS.
const SILENT =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";

// Rota desligada, sem configuração ou chave recusada: até recarregar, só a voz nativa.
let unavailable = false;
const listeners = new Set<() => void>();
function markUnavailable() {
  unavailable = true;
  for (const listener of listeners) listener();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
const isAvailable = () => elevenLabsTtsEnabled && !unavailable;

const usable = (text: string) =>
  isAvailable() && text.length > 0 && text.length <= MAX_TTS_CHARS;

// Falas fixas pré-geradas (`bun run voice:generate`): arquivo estático do
// próprio app, sem chamar o ElevenLabs nem gastar créditos. Valem com a flag
// ligada ou desligada; só o tempo real (rota) depende da flag.
const staticKeys = new Set<string>(manifest.keys);
const hasStatic = staticKeys.size > 0;
function staticUrl(text: string) {
  if (!hasStatic) return null;
  const key = phraseKey(text);
  return staticKeys.has(key)
    ? `${STATIC_VOICE_PATH}/${manifest.version}/${key}.mp3`
    : null;
}
/**
 * Áudio da fala: o pré-gerado; senão a rota, só com a flag ligada (desligada,
 * nenhum pedido sai para o serviço e a fala vai para a voz nativa).
 */
function sourceFor(text: string) {
  if (!text) return null;
  return staticUrl(text) ?? (usable(text) ? ttsUrl(text) : null);
}

/** Lê o status da rota (o `<audio>` não informa) e desliga em 503/403. */
async function check(response: Response) {
  if (response.status === 503 || response.status === 403) markUnavailable();
  return response.ok;
}

// Pré-carga: arquivos estáticos vão direto para o cache do navegador; falas
// novas entram em fila, uma geração por vez (o plano do ElevenLabs limita
// pedidos simultâneos). Servidor e navegador guardam o resultado.
const warmed = new Set<string>();
let queue = Promise.resolve();
function warm(text: string) {
  if (warmed.has(text)) return;
  warmed.add(text);
  const file = staticUrl(text);
  if (file) {
    void fetch(file, { priority: "low" }).catch(() => warmed.delete(text));
    return;
  }
  if (!usable(text)) {
    warmed.delete(text);
    return;
  }
  queue = queue.then(async () => {
    if (!isAvailable()) return;
    try {
      const response = await fetch(ttsUrl(text));
      if (await check(response)) await response.arrayBuffer();
      else warmed.delete(text);
    } catch {
      warmed.delete(text);
    }
  });
}

// Abre a conexão do servidor com o ElevenLabs antes de uma fala em tempo real.
const WARM_EVERY_MS = 20_000;
let warmedConnectionAt = 0;
function warmConnection() {
  if (!isAvailable() || Date.now() - warmedConnectionAt < WARM_EVERY_MS) return;
  warmedConnectionAt = Date.now();
  void fetch(`${TTS_PATH}?${TTS_WARM_PARAM}=1`, { priority: "low" })
    .then(check)
    .catch(() => {});
}

/**
 * Fala do Eletriquinho. Fala fixa sai sempre do arquivo pré-gerado
 * (`public/voz`). O resto (respostas da LLM) vem em stream de `/api/tts` só com
 * `NEXT_PUBLIC_TTS_ELEVENLABS=on` (se falhar, usa a voz nativa para aquela fala).
 * Desligada, nada vai ao serviço e a voz do navegador não é usada, para o timbre
 * não divergir: fala sem arquivo pré-gerado fica só no texto. Mesma
 * interface de `useSpeechSynthesis`, mais `preload` e `warm`.
 */
export function useSpeech() {
  const native = useSpeechSynthesis();
  const {
    speak: speakNative,
    cancel: cancelNative,
    prime: primeNative,
  } = native;
  const available = useSyncExternalStore(subscribe, isAvailable, () => false);
  const [speaking, setSpeaking] = useState(false);
  // O navegador recusou tocar (sem toque na página): quem usa pode pedir um toque.
  const [blocked, setBlocked] = useState(false);
  const player = useRef<HTMLAudioElement | null>(null);
  const request = useRef(0);

  const element = useCallback(() => {
    player.current ??= new Audio();
    return player.current;
  }, []);

  useEffect(
    () => () => {
      request.current += 1;
      player.current?.pause();
    },
    [],
  );

  const cancel = useCallback(() => {
    request.current += 1;
    player.current?.pause();
    setSpeaking(false);
    cancelNative();
  }, [cancelNative]);

  const speak = useCallback(
    (text: string) => {
      const message = text.trim();
      const url = sourceFor(message);
      if (!url) {
        // Desligada, não usa a voz do navegador (timbre diferente): sem arquivo
        // pré-gerado, a fala fica só no texto.
        if (message && elevenLabsTtsEnabled) speakNative(message);
        return;
      }
      const id = ++request.current;
      cancelNative();
      const audio = element();
      const fallback = () => {
        if (id !== request.current) return;
        request.current += 1;
        setSpeaking(false);
        if (elevenLabsTtsEnabled) speakNative(message);
        if (url.startsWith(TTS_PATH))
          void fetch(url)
            .then(check)
            .catch(() => {});
      };
      audio.onended = () => {
        if (id === request.current) setSpeaking(false);
      };
      audio.onplaying = () => setBlocked(false);
      audio.onerror = fallback;
      // Já “falando” durante o carregamento: a demo não avança antes da fala.
      setSpeaking(true);
      setBlocked(false);
      audio.src = url;
      audio.play().catch((error: unknown) => {
        if (!(error instanceof DOMException)) return fallback();
        // Trocar de fala ou cancelar interrompe o play anterior: não é falha.
        if (error.name === "AbortError") return;
        if (error.name === "NotAllowedError") {
          // Página aberta sem toque antes (link direto, recarregar): o navegador
          // bloqueia o som. A fala toca no primeiro clique ou tecla (no celular o
          // som só é liberado no fim do toque), se ainda for a atual.
          setSpeaking(false);
          setBlocked(true);
          const retry = () => {
            document.removeEventListener("click", retry, true);
            document.removeEventListener("keydown", retry, true);
            if (id !== request.current) return;
            setSpeaking(true);
            audio.play().catch(() => {
              if (id === request.current) setSpeaking(false);
            });
          };
          document.addEventListener("click", retry, true);
          document.addEventListener("keydown", retry, true);
          return;
        }
        fallback();
      });
    },
    [cancelNative, element, speakNative],
  );

  // Chamado no toque do usuário (microfone, abrir o assistente).
  const prime = useCallback(() => {
    if (elevenLabsTtsEnabled) primeNative();
    if (!elevenLabsTtsEnabled && !hasStatic) return;
    const audio = element();
    if (!audio.paused) return;
    audio.onended = null;
    audio.onerror = null;
    audio.src = SILENT;
    void audio.play().catch(() => {});
  }, [element, primeNative]);

  /** Baixa e guarda falas futuras sem tocar (ex.: narração da demonstração). */
  // Sem flag, `warm` só baixa arquivos pré-gerados; nunca pede à rota.
  const preload = useCallback((...texts: (string | undefined)[]) => {
    for (const text of texts) {
      const message = text?.trim() ?? "";
      if (message) warm(message);
    }
  }, []);

  return {
    // Desligada, só há voz para as falas pré-geradas (sem voz do navegador).
    supported:
      available || hasStatic || (elevenLabsTtsEnabled && native.supported),
    speaking: speaking || native.speaking,
    speak,
    cancel,
    prime,
    preload,
    warm: warmConnection,
    blocked,
  };
}
