import { z } from "zod";

export const TTS_PATH = "/api/tts";
export const TTS_TEXT_PARAM = "t";
export const TTS_WARM_PARAM = "warm";
/** Áudios pré-gerados (`bun run voice:generate`), servidos de `public/voz`. */
export const STATIC_VOICE_PATH = "/voz";
export const MAX_TTS_CHARS = 400;
export const TTS_TIMEOUT_MS = 15_000;

export const ttsRequestSchema = z.object({
  text: z.string().trim().min(1).max(MAX_TTS_CHARS),
});
export type TtsRequest = z.infer<typeof ttsRequestSchema>;

export const ttsUrl = (text: string) =>
  `${TTS_PATH}?${TTS_TEXT_PARAM}=${encodeURIComponent(text)}`;
