import "server-only";
import { z } from "zod";

const envSchema = z.object({
  GROQ_API_KEY: z.string().trim().min(1),
  GROQ_STT_MODEL: z
    .enum(["whisper-large-v3-turbo", "whisper-large-v3"])
    .default("whisper-large-v3-turbo"),
});

// Validação sob demanda: build e páginas não dependem de uma chave configurada.
export function getGroqEnv() {
  return envSchema.safeParse({
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_STT_MODEL: process.env.GROQ_STT_MODEL,
  });
}

export type GroqEnv = z.infer<typeof envSchema>;
