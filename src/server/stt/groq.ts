import "server-only";
import { PROVIDER_TIMEOUT_MS } from "@/lib/stt/constants";
import { transcriptionResponseSchema } from "@/lib/stt/schemas";
import type { GroqEnv } from "@/server/env";
import { TranscriptionError } from "@/server/stt/transcription-error";

export async function transcribeAudio(
  file: File,
  env: GroqEnv,
  signal: AbortSignal,
) {
  const form = new FormData();
  form.set("file", file, file.name);
  form.set("model", env.GROQ_STT_MODEL);
  form.set("language", "pt");
  form.set("response_format", "json");
  form.set("temperature", "0");

  let response: Response;
  try {
    response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${env.GROQ_API_KEY}` },
        body: form,
        signal: AbortSignal.any([
          signal,
          AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
        ]),
        cache: "no-store",
        redirect: "error",
      },
    );
  } catch (error) {
    if (signal.aborted) {
      throw new TranscriptionError(
        "CANCELLED",
        "A transcrição foi cancelada.",
        499,
      );
    }
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new TranscriptionError(
        "TIMEOUT",
        "A transcrição demorou mais que o esperado. Tente novamente.",
        504,
      );
    }
    throw new TranscriptionError(
      "PROVIDER_UNAVAILABLE",
      "Não foi possível acessar a transcrição. Tente novamente.",
      502,
    );
  }

  if (!response.ok) {
    // O corpo de erro do provedor não é exposto ao client nem registrado em logs.
    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      throw new TranscriptionError(
        "RATE_LIMITED",
        "O limite de transcrições foi atingido. Aguarde e tente novamente.",
        429,
        retryAfter && /^\d+$/.test(retryAfter) ? retryAfter : undefined,
      );
    }
    if (response.status === 401 || response.status === 403) {
      throw new TranscriptionError(
        "PROVIDER_AUTH_ERROR",
        "O serviço de transcrição não está disponível nesta configuração.",
        503,
      );
    }
    if ([400, 413, 415, 422].includes(response.status)) {
      throw new TranscriptionError(
        "UNPROCESSABLE_AUDIO",
        "Não foi possível processar esse áudio. Grave novamente.",
        422,
      );
    }
    throw new TranscriptionError(
      "PROVIDER_UNAVAILABLE",
      "O serviço de transcrição está indisponível. Tente novamente.",
      502,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new TranscriptionError(
      "INVALID_PROVIDER_RESPONSE",
      "Não foi possível ler a resposta da transcrição. Tente novamente.",
      502,
    );
  }
  if (
    typeof payload === "object" &&
    payload !== null &&
    "text" in payload &&
    typeof payload.text === "string" &&
    payload.text.trim() === ""
  ) {
    throw new TranscriptionError(
      "NO_TRANSCRIPT",
      "Nenhum texto foi identificado. Tente falar mais perto do microfone.",
      422,
    );
  }
  const result = transcriptionResponseSchema.safeParse(payload);
  if (!result.success) {
    throw new TranscriptionError(
      "INVALID_PROVIDER_RESPONSE",
      "A resposta da transcrição não pôde ser utilizada. Tente novamente.",
      502,
    );
  }
  return result.data;
}
