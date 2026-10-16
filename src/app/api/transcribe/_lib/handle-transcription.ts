import "server-only";
import { readAudioForm } from "@/app/api/transcribe/_lib/read-audio-form";
import {
  CLIENT_HEADER,
  CLIENT_HEADER_VALUE,
  MAX_AUDIO_BYTES,
} from "@/lib/stt/constants";
import { audioFileSchema } from "@/lib/stt/schemas";
import { getGroqEnv } from "@/server/env";
import { transcribeAudio } from "@/server/stt/groq";
import { TranscriptionError } from "@/server/stt/transcription-error";

function failure(
  code: string,
  message: string,
  status: number,
  retryAfter?: string,
) {
  return Response.json(
    { error: { code, message } },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(retryAfter ? { "Retry-After": retryAfter } : {}),
      },
    },
  );
}

export async function handleTranscription(request: Request) {
  // Um formulário externo não deve consumir a cota do serviço.
  // Header não simples exige preflight entre origens; a API não libera CORS.
  const site = request.headers.get("sec-fetch-site");
  if (
    request.headers.get(CLIENT_HEADER) !== CLIENT_HEADER_VALUE ||
    site === "cross-site" ||
    site === "same-site"
  ) {
    return failure(
      "FORBIDDEN_REQUEST",
      "Envie o áudio pela página do aplicativo.",
      403,
    );
  }

  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) {
    return failure("INVALID_REQUEST", "Envie uma gravação de áudio.", 415);
  }

  let form: FormData;
  try {
    form = await readAudioForm(request);
  } catch (error) {
    if (error instanceof TranscriptionError) {
      return failure(error.code, error.message, error.status);
    }
    return failure(
      "INVALID_REQUEST",
      "Não foi possível ler a gravação enviada.",
      400,
    );
  }

  const files = form.getAll("audio");
  if (files.length !== 1) {
    return failure(
      "INVALID_AUDIO",
      "Envie uma única gravação no campo audio.",
      400,
    );
  }
  const file = files[0];
  if (file instanceof File && file.size > MAX_AUDIO_BYTES) {
    return failure(
      "AUDIO_TOO_LARGE",
      "A gravação deve ter no máximo 4 MB.",
      413,
    );
  }
  const audio = audioFileSchema.safeParse(file);
  if (!audio.success) {
    return failure("INVALID_AUDIO", audio.error.issues[0].message, 400);
  }
  const env = getGroqEnv();
  if (!env.success) {
    return failure(
      "CONFIGURATION_ERROR",
      "A transcrição ainda não foi configurada neste ambiente.",
      503,
    );
  }

  try {
    const result = await transcribeAudio(audio.data, env.data, request.signal);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof TranscriptionError) {
      return failure(error.code, error.message, error.status, error.retryAfter);
    }
    return failure(
      "TRANSCRIPTION_FAILED",
      "Não foi possível transcrever o áudio.",
      502,
    );
  }
}
