import "server-only";

// Cada modelo da Groq tem cota própria (RPM/RPD/TPM/TPD). Ao receber 429 de
// um deles, tenta o próximo da lista. O modelo limitado fica de molho pelo
// tempo do Retry-After, para as próximas requisições não pagarem a falha.
const MIN_COOLDOWN_MS = 5_000;
const MAX_COOLDOWN_MS = 10 * 60_000;
const DEFAULT_COOLDOWN_MS = 60_000;

const cooldownUntil = new Map<string, number>();

type ProviderError = Error & {
  status: number;
  code?: string;
  retryAfter?: string;
};

function isProviderError(error: unknown): error is ProviderError {
  return error instanceof Error && "status" in error;
}

// 429: modelo sem cota. Resposta inválida: modelo menor errou o contrato; o próximo
// da cadeia costuma acertar. Os demais erros não trocam de modelo.
function shouldTryNext(error: unknown): error is ProviderError {
  return (
    isProviderError(error) &&
    (error.status === 429 || error.code === "INVALID_PROVIDER_RESPONSE")
  );
}

function cooldownFor(error: ProviderError) {
  const seconds = Number(error.retryAfter);
  const ms = Number.isFinite(seconds) ? seconds * 1000 : DEFAULT_COOLDOWN_MS;
  return Math.min(Math.max(ms, MIN_COOLDOWN_MS), MAX_COOLDOWN_MS);
}

/** Modelos em ordem de preferência; o primeiro é o configurado no ambiente. */
export function modelChain(primary: string, fallbacks: readonly string[]) {
  return [primary, ...fallbacks.filter((model) => model !== primary)];
}

export async function withModelFallback<T>(
  models: readonly string[],
  attempt: (model: string) => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const ready = models.filter(
    (model) => (cooldownUntil.get(model) ?? 0) <= now,
  );
  // Se todos estiverem em cooldown, tenta a lista completa: o limite pode
  // ter sido liberado antes do previsto e a falha final carrega o Retry-After.
  const queue = ready.length ? ready : models;

  let lastError: unknown;
  for (const model of queue) {
    try {
      return await attempt(model);
    } catch (error) {
      if (!shouldTryNext(error)) throw error;
      if (error.status === 429) {
        cooldownUntil.set(model, Date.now() + cooldownFor(error));
        console.warn(
          `[groq] limite atingido em ${model}; tentando alternativa.`,
        );
      } else {
        console.warn(
          `[groq] resposta inválida de ${model}; tentando alternativa.`,
        );
      }
      lastError = error;
    }
  }
  throw lastError;
}
