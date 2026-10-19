/**
 * Pré-gera a voz do Eletriquinho para todas as falas fixas.
 *
 *   bun run voice:generate
 *
 * Lê a chave e a voz do `.env` (as mesmas variáveis do Route Handler), busca o
 * conteúdo do serviço no backend (`NEXT_PUBLIC_API_URL`), gera um MP3 por fala
 * em `public/voz/<versão>/<chave>.mp3` e grava o manifesto em
 * `src/lib/tts/voice-manifest.json`. Falas já geradas não são pedidas de novo;
 * trocar voz, modelo ou ajustes cria outra versão e apaga a anterior.
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { PARTS, partTeaches } from "@/app/servicos/segunda-via/_lib/steps";
import { secondCopyTargets } from "@/app/servicos/segunda-via/_lib/voice-target";
import { ASSISTANT_PHRASES, labelPhrases } from "@/lib/assistant/fixed-replies";
import { homeTarget } from "@/lib/assistant/journey";
import { MAX_TTS_CHARS } from "@/lib/tts/constants";
import {
  parseElevenLabsEnv,
  speechRequest,
  voiceVersion,
} from "@/lib/tts/elevenlabs";
import { bundlePhrases, FRONT_PHRASES } from "@/lib/tts/fixed-phrases";
import { normalizePhrase, phraseKey } from "@/lib/tts/phrase-key";
import { trackBundleSchema } from "@/schemas/http/track";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC_DIR = join(ROOT, "public", "voz");
const MANIFEST = join(ROOT, "src", "lib", "tts", "voice-manifest.json");
const TRACKS = ["segunda-via"];

/** Código-fonte de todas as telas (arquivos .tsx em src/app). */
async function appSources() {
  const app = join(ROOT, "src", "app");
  const files = (await readdir(app, { recursive: true })).filter((file) =>
    file.endsWith(".tsx"),
  );
  return Promise.all(files.map((file) => readFile(join(app, file), "utf8")));
}

/**
 * Nomes dos botões do assistente: destinos da jornada, sugestões das telas
 * (`label` seguido de `confirmation`) e serviços disponíveis do backend. Cada um
 * vira “Você quis dizer…?” e a confirmação de saída da prática.
 */
async function actionLabels(api: string) {
  const labels = [homeTarget.label, ...secondCopyTargets.map((t) => t.label)];
  for (const source of await appSources())
    for (const match of source.matchAll(
      /label:\s*"((?:[^"\\]|\\.)*)",\s*confirmation:/g,
    ))
      labels.push(JSON.parse(`"${match[1]}"`));
  const response = await fetch(`${api}/tracks`);
  if (response.ok)
    for (const track of (await response.json()) as {
      title: string;
      status: string;
    }[])
      if (track.status === "available") labels.push(track.title);
  return [...new Set(labels)];
}

/** `teaches` das telas (texto literal) e o das partes da etapa 2. */
async function screenPhrases() {
  const found: string[] = [];
  for (const source of await appSources())
    for (const match of source.matchAll(/teaches:\s*"((?:[^"\\]|\\.)*)"/g))
      found.push(JSON.parse(`"${match[1]}"`));
  return [
    ...found,
    ...PARTS.map((part, index) => partTeaches(index + 1, part.label)),
  ];
}

const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

async function bundleTexts() {
  if (!api) throw new Error("Defina NEXT_PUBLIC_API_URL (com /api/v1).");
  const texts: string[] = [];
  for (const track of TRACKS) {
    const response = await fetch(`${api}/tracks/${track}/bundle`);
    if (!response.ok)
      throw new Error(
        `Backend respondeu ${response.status} para ${track}. Ele está rodando?`,
      );
    texts.push(
      ...bundlePhrases(trackBundleSchema.parse(await response.json())),
    );
  }
  return texts;
}

async function generate(
  text: string,
  env: Parameters<typeof speechRequest>[1],
) {
  for (let attempt = 1; ; attempt++) {
    const { url, init } = speechRequest(text, env, { stream: false });
    const response = await fetch(url, init);
    if (response.ok) return new Uint8Array(await response.arrayBuffer());
    if (response.status === 429 && attempt < 4) {
      await sleep(Number(response.headers.get("retry-after") ?? 2) * 1000);
      continue;
    }
    throw new Error(
      `ElevenLabs respondeu ${response.status} (confira chave, voz e créditos).`,
    );
  }
}

const env = parseElevenLabsEnv(process.env);
if (!env.success) {
  console.error(
    "Configure ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID no .env antes de gerar.",
  );
  process.exit(1);
}

const phrases = [
  ...new Set(
    [
      ...FRONT_PHRASES,
      ...ASSISTANT_PHRASES,
      ...(await screenPhrases()),
      ...(await bundleTexts()),
      ...labelPhrases(await actionLabels(api)),
    ]
      .map(normalizePhrase)
      .filter((text) => text.length > 0 && text.length <= MAX_TTS_CHARS),
  ),
];
const version = voiceVersion(env.data);
const dir = join(PUBLIC_DIR, version);
await mkdir(dir, { recursive: true });

// Versões antigas (outra voz ou ajuste) saem do app.
for (const entry of await readdir(PUBLIC_DIR))
  if (entry !== version) await rm(join(PUBLIC_DIR, entry), { recursive: true });

const existing = new Set(await readdir(dir));
const keys = phrases.map(phraseKey);
let created = 0;
let characters = 0;
for (const [index, text] of phrases.entries()) {
  const file = `${keys[index]}.mp3`;
  if (existing.has(file)) continue;
  await writeFile(join(dir, file), await generate(text, env.data));
  created++;
  characters += text.length;
  console.log(`✓ ${file}  ${text.slice(0, 60)}${text.length > 60 ? "…" : ""}`);
}

// Falas que saíram do conteúdo deixam de ocupar espaço.
const wanted = new Set(keys.map((key) => `${key}.mp3`));
for (const file of existing) if (!wanted.has(file)) await rm(join(dir, file));

await writeFile(
  MANIFEST,
  `${JSON.stringify({ version, keys: [...new Set(keys)].sort() }, null, 2)}\n`,
);
console.log(
  `\n${phrases.length} falas fixas · ${created} geradas agora (${characters} caracteres) · versão ${version}`,
);
