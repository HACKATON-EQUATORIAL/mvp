import {
  CLIENT_HEADER,
  CLIENT_HEADER_VALUE,
  TRANSCRIBE_PATH,
  TRANSCRIPTION_TIMEOUT_MS,
} from "@/lib/stt/constants";
import {
  type Transcription,
  transcriptionErrorSchema,
  transcriptionResponseSchema,
} from "@/lib/stt/schemas";

// O navegador fala somente com a API do app, nunca recebe a chave do provedor.
export async function requestTranscription(
  file: File,
  signal: AbortSignal,
): Promise<Transcription> {
  const timeout = AbortSignal.timeout(TRANSCRIPTION_TIMEOUT_MS);
  try {
    const form = new FormData();
    form.set("audio", file);
    const response = await fetch(TRANSCRIBE_PATH, {
      method: "POST",
      headers: { [CLIENT_HEADER]: CLIENT_HEADER_VALUE },
      body: form,
      signal: AbortSignal.any([signal, timeout]),
      cache: "no-store",
    });
    const payload: unknown = await response.json();
    if (!response.ok) {
      const failure = transcriptionErrorSchema.safeParse(payload);
      throw new Error(
        failure.success
          ? failure.data.error.message
          : "Não foi possível transcrever a gravação.",
      );
    }
    const result = transcriptionResponseSchema.safeParse(payload);
    if (!result.success)
      throw new Error("A resposta não contém uma transcrição válida.");
    return result.data;
  } catch (cause) {
    if (signal.aborted) throw cause;
    if (timeout.aborted)
      throw new Error("O envio demorou mais que o esperado. Tente novamente.");
    if (cause instanceof TypeError || cause instanceof SyntaxError)
      throw new Error(
        "Não foi possível acessar a transcrição. Verifique sua conexão e tente novamente.",
      );
    throw cause;
  }
}
