import "server-only";
import { z } from "zod";
import { type ElevenLabsEnv, parseElevenLabsEnv } from "@/lib/tts/elevenlabs";

// Ordem de reserva quando o modelo principal atinge o limite (429). Todos
// suportam JSON Schema estrito na Groq, exigido pela interpretação.
export const LLM_MODELS = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
] as const;
export const STT_MODELS = [
  "whisper-large-v3-turbo",
  "whisper-large-v3",
] as const;

const envSchema = z.object({
  GROQ_API_KEY: z.string().trim().min(1),
  GROQ_STT_MODEL: z.enum(STT_MODELS).default("whisper-large-v3-turbo"),
});

// Validação sob demanda: build e páginas não dependem de uma chave configurada.
export function getGroqEnv() {
  return envSchema.safeParse({
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_STT_MODEL: process.env.GROQ_STT_MODEL,
  });
}

export type GroqEnv = z.infer<typeof envSchema>;

const interpretationEnvSchema = z.object({
  GROQ_API_KEY: z.string().trim().min(1),
  GROQ_LLM_MODEL: z.enum(LLM_MODELS).default("openai/gpt-oss-20b"),
});
export function getGroqInterpretationEnv() {
  return interpretationEnvSchema.safeParse({
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_LLM_MODEL: process.env.GROQ_LLM_MODEL,
  });
}
export type GroqInterpretationEnv = z.infer<typeof interpretationEnvSchema>;

// Voz do ElevenLabs: schema compartilhado com o script de pré-geração.
export function getElevenLabsEnv() {
  return parseElevenLabsEnv(process.env);
}
export type { ElevenLabsEnv };
