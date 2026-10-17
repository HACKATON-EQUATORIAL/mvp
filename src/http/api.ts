import { z } from "zod";
import { getApiUrl } from "@/config/api";
import { ApiError } from "@/lib/error/api-error";

const errorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});

export async function apiGet<T>(
  path: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "omit",
    cache: "no-store",
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(15_000)])
      : AbortSignal.timeout(15_000),
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
