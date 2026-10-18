import { CLIENT_HEADER, CLIENT_HEADER_VALUE } from "@/lib/stt/constants";
import {
  INTERPRET_TIMEOUT_MS,
  type InterpretationRequest,
  interpretationErrorSchema,
  interpretationRequestSchema,
  interpretationResultSchema,
  MAX_INTERPRET_BYTES,
  matchesAllowedSuggestions,
} from "./schemas";

export async function requestInterpretation(
  input: InterpretationRequest,
  signal: AbortSignal,
) {
  // The provider sees IDs and descriptions, never destinations.
  const bounded = { ...input, history: [...input.history] };
  while (
    bounded.history.length &&
    new TextEncoder().encode(JSON.stringify(bounded)).byteLength >
      MAX_INTERPRET_BYTES
  )
    bounded.history.shift();
  const body = interpretationRequestSchema.safeParse(bounded);
  if (!body.success)
    throw new Error(
      "Não foi possível interpretar esse texto nesta tela. Grave novamente ou use as opções.",
    );
  const timeout = AbortSignal.timeout(INTERPRET_TIMEOUT_MS);
  try {
    const response = await fetch("/api/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [CLIENT_HEADER]: CLIENT_HEADER_VALUE,
      },
      body: JSON.stringify(body.data),
      cache: "no-store",
      signal: AbortSignal.any([signal, timeout]),
    });
    const payload: unknown = await response.json();
    if (!response.ok) {
      const failure = interpretationErrorSchema.safeParse(payload);
      throw new Error(
        failure.success
          ? failure.data.error.message
          : "Não foi possível interpretar seu pedido.",
      );
    }
    const result = interpretationResultSchema.safeParse(payload);
    if (!result.success || !matchesAllowedSuggestions(result.data, body.data))
      throw new Error(
        "Não foi possível confirmar uma opção segura para seu pedido. Use as opções da tela.",
      );
    return result.data;
  } catch (cause) {
    if (signal.aborted) throw cause;
    if (timeout.aborted)
      throw new Error(
        "A interpretação demorou mais que o esperado. Tente novamente.",
      );
    if (cause instanceof TypeError || cause instanceof SyntaxError)
      throw new Error(
        "Não foi possível acessar o assistente. Confira a conexão e tente novamente.",
      );
    throw cause;
  }
}

export function isInternalVoiceHref(href: string) {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    Array.from(href).some(
      (character) =>
        character.charCodeAt(0) <= 32 || character === String.fromCharCode(92),
    )
  )
    return false;
  try {
    return (
      new URL(href, "https://digitaliza.invalid").origin ===
      "https://digitaliza.invalid"
    );
  } catch {
    return false;
  }
}
