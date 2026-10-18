const KEY = "digitaliza:session-id";
let memory: string | undefined;

/**
 * UUID anônimo que agrupa as tentativas de prática deste navegador (sem login
 * nem dado pessoal). Cai para memória quando o armazenamento está bloqueado.
 */
export function getSessionId() {
  if (memory) return memory;
  try {
    memory = localStorage.getItem(KEY) ?? undefined;
    if (!memory) {
      memory = crypto.randomUUID();
      localStorage.setItem(KEY, memory);
    }
  } catch {
    memory ??= crypto.randomUUID();
  }
  return memory;
}
