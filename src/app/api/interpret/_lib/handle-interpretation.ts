import "server-only";
import {
  interpretationRequestSchema,
  MAX_INTERPRET_BYTES,
} from "@/lib/assistant/schemas";
import { CLIENT_HEADER, CLIENT_HEADER_VALUE } from "@/lib/stt/constants";
import { interpretWithGroq } from "@/server/assistant/groq";
import { InterpretationError } from "@/server/assistant/interpretation-error";
import { getGroqInterpretationEnv } from "@/server/env";

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

async function readJson(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing body");
  let size = 0;
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_INTERPRET_BYTES) {
        await reader.cancel();
        throw new InterpretationError(
          "REQUEST_TOO_LARGE",
          "O pedido está muito longo. Grave uma mensagem mais curta.",
          413,
        );
      }
      chunks.push(new Uint8Array(value));
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(await new Blob(chunks).text());
}

export async function handleInterpretation(request: Request) {
  const site = request.headers.get("sec-fetch-site");
  if (
    request.headers.get(CLIENT_HEADER) !== CLIENT_HEADER_VALUE ||
    site === "cross-site" ||
    site === "same-site"
  )
    return failure(
      "FORBIDDEN_REQUEST",
      "Use o assistente pela página do aplicativo.",
      403,
    );
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return failure("INVALID_REQUEST", "Envie o pedido em JSON.", 415);
  try {
    const parsed = interpretationRequestSchema.safeParse(
      await readJson(request),
    );
    if (!parsed.success)
      return failure(
        "INVALID_REQUEST",
        "O pedido ou as opções desta tela não são válidos. Grave novamente ou use os botões.",
        400,
      );
    const env = getGroqInterpretationEnv();
    if (!env.success)
      return failure(
        "CONFIGURATION_ERROR",
        "A interpretação ainda não foi configurada. Use as opções da tela.",
        503,
      );
    const result = await interpretWithGroq(
      parsed.data,
      env.data,
      request.signal,
    );
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof InterpretationError)
      return failure(error.code, error.message, error.status, error.retryAfter);
    if (error instanceof SyntaxError)
      return failure(
        "INVALID_REQUEST",
        "Não foi possível ler o pedido enviado.",
        400,
      );
    return failure(
      "INTERPRETATION_FAILED",
      "Não foi possível interpretar seu pedido. Tente novamente ou use os botões.",
      502,
    );
  }
}
