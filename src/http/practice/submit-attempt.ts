import { apiRequest } from "@/http/api";
import { ApiError } from "@/lib/error/api-error";
import { attemptStateSchema, type PracticeMode } from "@/schemas/http/practice";

export type SubmitStep =
  | { type: "action"; item_id: string; option_id: string }
  | {
      type: "help";
      item_id: string;
      kind: "hint" | "explanation" | "accessibility";
    };

export type SubmitBody = {
  track_id: string;
  mode: PracticeMode;
  item_ids?: string[];
  steps: SubmitStep[];
};

const QUEUE_KEY = "digitaliza:pending-submits";

function readQueue(): SubmitBody[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeQueue(queue: SubmitBody[]) {
  try {
    if (queue.length) localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    else localStorage.removeItem(QUEUE_KEY);
  } catch {
    // Sem armazenamento: o envio só vale nesta página.
  }
}

const send = (body: SubmitBody) =>
  apiRequest("practice/attempts/submit", attemptStateSchema, {
    method: "POST",
    body,
    session: true,
  });

/**
 * Envio único da prática (o backend refaz a correção). Se falhar, guarda na fila
 * e tenta de novo depois; a pessoa segue sem esperar.
 */
export async function submitAttempt(body: SubmitBody) {
  try {
    return await send(body);
  } catch (error) {
    if (retryable(error)) writeQueue([...readQueue(), body]);
    return null;
  }
}

// Rede ou servidor fora: vale tentar de novo. Recusa do backend (4xx) não.
const retryable = (error: unknown) =>
  !(error instanceof ApiError) || error.status >= 500;

let flushing = false;

/** Reenvia, em segundo plano, envios que falharam antes (um reenvio por vez). */
export async function flushPendingSubmits() {
  if (flushing) return;
  const queue = readQueue();
  if (!queue.length) return;
  flushing = true;
  writeQueue([]);
  const left: SubmitBody[] = [];
  for (const body of queue) {
    try {
      await send(body);
    } catch (error) {
      if (retryable(error)) left.push(body);
    }
  }
  writeQueue([...readQueue(), ...left]);
  flushing = false;
}
