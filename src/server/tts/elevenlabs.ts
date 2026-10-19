import "server-only";
import { createHash } from "node:crypto";
import { Agent, fetch as undiciFetch } from "undici";
import { TTS_TIMEOUT_MS } from "@/lib/tts/constants";
import {
  ELEVENLABS_ORIGIN,
  type ElevenLabsEnv,
  speechRequest,
  voiceVersion,
} from "@/lib/tts/elevenlabs";
import { TtsError } from "@/server/tts/tts-error";

const CACHE_LIMIT = 200;
const WARM_EVERY_MS = 20_000;

// Conexão (TCP + TLS) aberta por até 2 min sem uso: o fetch padrão do Node
// fecha em 4 s, e reabrir custa cerca de 0,4 s em cada fala. Medido: primeiro
// byte de ~0,45 s com a conexão quente contra 0,8–1,35 s com ela fria.
const dispatcher = new Agent({
  keepAliveTimeout: 120_000,
  keepAliveMaxTimeout: 600_000,
});

// Falas repetidas (narração da demo, confirmações) não gastam créditos de novo.
// LRU simples: o Map mantém a ordem de inserção; acesso move para o fim.
const cache = new Map<string, Uint8Array<ArrayBuffer>>();

// Geração em andamento: pedidos iguais (pré-carga e fala) ouvem o mesmo stream.
type Job = {
  chunks: Uint8Array[];
  done: boolean;
  failed: boolean;
  waiters: Set<() => void>;
};
const jobs = new Map<string, Promise<Job>>();

function cacheKey(text: string, env: ElevenLabsEnv) {
  return createHash("sha256")
    .update(`${voiceVersion(env)}|${text}`)
    .digest("hex");
}

let warmedAt = 0;
/**
 * Abre a conexão com o ElevenLabs antes da fala (ex.: enquanto a LLM pensa).
 * Pedido leve, sem gerar áudio nem gastar créditos.
 */
export function warmConnection() {
  if (Date.now() - warmedAt < WARM_EVERY_MS) return;
  warmedAt = Date.now();
  // GET sem chave (responde 404 rápido). HEAD recebe 405 e não deixa a
  // conexão reaproveitável; ler o corpo libera a conexão para a fala.
  void undiciFetch(`${ELEVENLABS_ORIGIN}/v1/models`, {
    dispatcher,
    signal: AbortSignal.timeout(TTS_TIMEOUT_MS),
  })
    .then((response) => response.arrayBuffer())
    .catch(() => {
      warmedAt = 0;
    });
}

function concat(chunks: Uint8Array[]) {
  const out = new Uint8Array(
    chunks.reduce((sum, chunk) => sum + chunk.length, 0),
  );
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

function remember(key: string, audio: Uint8Array<ArrayBuffer>) {
  cache.set(key, audio);
  if (cache.size <= CACHE_LIMIT) return;
  const oldest = cache.keys().next().value;
  if (oldest) cache.delete(oldest);
}

/** Stream que repete os pedaços já recebidos e segue a geração até o fim. */
function listen(job: Job) {
  let index = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      while (index >= job.chunks.length && !job.done && !job.failed)
        await new Promise<void>((resolve) => {
          job.waiters.add(resolve);
        });
      if (index < job.chunks.length) controller.enqueue(job.chunks[index++]);
      else if (job.failed) controller.error(new Error("TTS interrompido"));
      else controller.close();
    },
  });
}

function notify(job: Job) {
  const waiters = [...job.waiters];
  job.waiters.clear();
  for (const resolve of waiters) resolve();
}

async function request(text: string, env: ElevenLabsEnv) {
  const { url, init } = speechRequest(text, env, { stream: true });
  let response: Awaited<ReturnType<typeof undiciFetch>>;
  try {
    response = await undiciFetch(url, {
      ...init,
      dispatcher,
      // Sem o sinal do pedido: uma fala cancelada termina e fica no cache.
      signal: AbortSignal.timeout(TTS_TIMEOUT_MS),
    });
    warmedAt = Date.now();
  } catch {
    throw new TtsError(
      "PROVIDER_UNAVAILABLE",
      "Não foi possível falar com o serviço de voz.",
      502,
    );
  }

  if (response.ok && response.body) return response.body;
  if (response.status === 401 || response.status === 403)
    throw new TtsError(
      "PROVIDER_AUTH_ERROR",
      "A voz não foi autorizada pelo serviço.",
      503,
    );
  if (response.status === 429)
    throw new TtsError(
      "RATE_LIMITED",
      "Limite do serviço de voz atingido.",
      429,
      response.headers.get("retry-after") ?? undefined,
    );
  // 400/404/422: voz, modelo ou ajuste inválido na configuração.
  if (response.status >= 400 && response.status < 500)
    throw new TtsError(
      "CONFIGURATION_ERROR",
      "A voz configurada não foi aceita pelo serviço.",
      503,
    );
  throw new TtsError("TTS_FAILED", "Não foi possível gerar a fala.", 502);
}

/**
 * Áudio da fala em stream (MP3): o navegador começa a tocar no primeiro pedaço.
 * Cache pronto responde na hora; geração igual em andamento é compartilhada.
 */
export async function synthesizeSpeech(text: string, env: ElevenLabsEnv) {
  const key = cacheKey(text, env);
  const hit = cache.get(key);
  if (hit) {
    cache.delete(key);
    cache.set(key, hit);
    return { audio: hit, cached: true };
  }
  const running = jobs.get(key);
  if (running) return { audio: listen(await running), cached: true };

  // Registrado antes de esperar o provedor: um pedido igual logo em seguida
  // (pré-carga e fala) aguarda esta geração em vez de abrir outra.
  const started = start(key, text, env);
  jobs.set(key, started);
  started.catch(() => jobs.delete(key));
  return { audio: listen(await started), cached: false };
}

async function start(key: string, text: string, env: ElevenLabsEnv) {
  const body = await request(text, env);
  const job: Job = {
    chunks: [],
    done: false,
    failed: false,
    waiters: new Set(),
  };
  void (async () => {
    const reader = body.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        job.chunks.push(value);
        notify(job);
      }
      remember(key, concat(job.chunks));
      job.done = true;
    } catch {
      job.failed = true;
    } finally {
      jobs.delete(key);
      notify(job);
    }
  })();
  return job;
}
