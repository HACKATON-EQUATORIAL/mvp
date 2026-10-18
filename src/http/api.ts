import { z } from "zod";
import { getApiUrl } from "@/config/api";
import { ApiError } from "@/lib/error/api-error";
import { getSessionId } from "@/lib/session-id";

const errorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  /** Envia o X-Session-Id anônimo (prática e eventos). */
  session?: boolean;
  /** Mantém o envio mesmo se a página fechar (eventos ao sair). */
  keepalive?: boolean;
  signal?: AbortSignal;
};

// O ngrok free intercepta fetch entre domínios com uma página de aviso (sem
// CORS); este header a dispensa. Só é enviado a hosts ngrok.
function transportHeaders(url: string, options: RequestOptions): HeadersInit {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (new URL(url).hostname.includes("ngrok"))
    headers["ngrok-skip-browser-warning"] = "1";
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.session) headers["X-Session-Id"] = getSessionId();
  return headers;
}

export async function apiRequest<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${getApiUrl()}${path}`;
  const timeout = AbortSignal.timeout(15_000);
  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: transportHeaders(url, options),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    credentials: "omit",
    cache: "no-store",
    keepalive: options.keepalive,
    signal: options.signal
      ? AbortSignal.any([options.signal, timeout])
      : timeout,
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = errorSchema.safeParse(body);
    throw new ApiError(
      error.success
        ? error.data.error.message
        : "Não foi possível carregar os dados.",
      response.status,
      error.success ? error.data.error.code : "http_error",
    );
  }
  const result = schema.safeParse(body);
  if (!result.success)
    throw new ApiError(
      "A API retornou dados em um formato inesperado.",
      response.status,
      "invalid_response",
    );
  return result.data;
}

export function apiGet<T>(
  path: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> {
  return apiRequest(path, schema, { signal });
}
