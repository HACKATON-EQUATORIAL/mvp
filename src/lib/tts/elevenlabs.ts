import { z } from "zod";
import { phraseKey } from "@/lib/tts/phrase-key";

// Usado pelo Route Handler (server/tts) e pelo script de pré-geração
// (scripts/generate-voice.ts). Nunca importar em componente do navegador: lê a chave.

export const ELEVENLABS_ORIGIN = "https://api.elevenlabs.io";
// 22 kHz / 32 kbps: voz nítida com metade do tamanho (rede móvel fraca).
export const OUTPUT_FORMAT = "mp3_22050_32";

// Ajustes da voz (mesmos sliders do site do ElevenLabs); vazio usa o padrão.
const setting = (fallback: number, min: number, max: number) =>
  z.preprocess(
    (value) => (value === undefined || value === "" ? undefined : value),
    z.coerce.number().min(min).max(max).default(fallback),
  );

const elevenLabsEnvSchema = z.object({
  ELEVENLABS_API_KEY: z.string().trim().min(1),
  ELEVENLABS_VOICE_ID: z.string().trim().min(1),
  ELEVENLABS_MODEL_ID: z.string().trim().min(1).default("eleven_flash_v2_5"),
  ELEVENLABS_STABILITY: setting(0.4, 0, 1),
  ELEVENLABS_SIMILARITY: setting(0.75, 0, 1),
  ELEVENLABS_STYLE: setting(0, 0, 1),
  ELEVENLABS_SPEED: setting(0.93, 0.7, 1.2),
});
export type ElevenLabsEnv = z.infer<typeof elevenLabsEnvSchema>;

export function parseElevenLabsEnv(env: NodeJS.ProcessEnv) {
  return elevenLabsEnvSchema.safeParse({
    ELEVENLABS_API_KEY: env.ELEVENLABS_API_KEY,
    ELEVENLABS_VOICE_ID: env.ELEVENLABS_VOICE_ID,
    ELEVENLABS_MODEL_ID: env.ELEVENLABS_MODEL_ID || undefined,
    ELEVENLABS_STABILITY: env.ELEVENLABS_STABILITY,
    ELEVENLABS_SIMILARITY: env.ELEVENLABS_SIMILARITY,
    ELEVENLABS_STYLE: env.ELEVENLABS_STYLE,
    ELEVENLABS_SPEED: env.ELEVENLABS_SPEED,
  });
}

export function voiceSettings(env: ElevenLabsEnv) {
  return {
    stability: env.ELEVENLABS_STABILITY,
    similarity_boost: env.ELEVENLABS_SIMILARITY,
    style: env.ELEVENLABS_STYLE,
    speed: env.ELEVENLABS_SPEED,
    use_speaker_boost: true,
  };
}

/** Versão da voz: muda quando voz, modelo, ajustes ou formato mudam. */
export function voiceVersion(env: ElevenLabsEnv) {
  return phraseKey(
    JSON.stringify([
      env.ELEVENLABS_VOICE_ID,
      env.ELEVENLABS_MODEL_ID,
      voiceSettings(env),
      OUTPUT_FORMAT,
    ]),
  );
}

/** Pedido de fala ao ElevenLabs (`stream`: o áudio chega em pedaços). */
export function speechRequest(
  text: string,
  env: ElevenLabsEnv,
  { stream }: { stream: boolean },
) {
  const voice = encodeURIComponent(env.ELEVENLABS_VOICE_ID);
  return {
    url: `${ELEVENLABS_ORIGIN}/v1/text-to-speech/${voice}${stream ? "/stream" : ""}?output_format=${OUTPUT_FORMAT}`,
    init: {
      method: "POST",
      headers: {
        "xi-api-key": env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: env.ELEVENLABS_MODEL_ID,
        language_code: "pt",
        voice_settings: voiceSettings(env),
      }),
    },
  };
}
