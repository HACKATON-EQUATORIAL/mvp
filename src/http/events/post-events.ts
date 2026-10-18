import { z } from "zod";
import { apiRequest } from "@/http/api";

const acceptedSchema = z.object({ accepted: z.number() });

// Eventos de navegação aceitos por POST /events (sem texto livre). Ficam numa
// fila e vão em lote: no envio final da prática ou ao sair da página.
export type NavigationEvent =
  | {
      type: "journey_entered";
      payload: { intent: "learn" | "consult" | "blocked" | "go_to_channel" };
    }
  | {
      type: "explanation_viewed";
      payload: { step_id: string; source: "learn" | "consult" | "help" };
    }
  | {
      type: "difficulty_reported";
      payload: {
        option_id: string;
        classification: "teachable" | "external_block";
      };
    }
  | {
      type: "channel_exit_clicked";
      payload: {
        origin: "entry" | "practice_completed" | "consult" | "difficulty";
      };
    };

const MAX_BATCH = 50;
const queue: Record<string, unknown>[] = [];
let listening = false;

export function postEvent(event: NavigationEvent, trackId = "segunda-via") {
  queue.push({
    ...event,
    event_id: crypto.randomUUID(),
    track_id: trackId,
    occurred_at: new Date().toISOString(),
  });
  if (!listening && typeof window !== "undefined") {
    listening = true;
    window.addEventListener("pagehide", () => flushEvents(true));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushEvents(true);
    });
  }
  if (queue.length >= MAX_BATCH) flushEvents();
}

/** Envia a fila (melhor-esforço); `keepalive` segura o envio ao sair da página. */
export function flushEvents(keepalive = false) {
  if (!queue.length) return;
  const events = queue.splice(0, MAX_BATCH);
  void apiRequest("events", acceptedSchema, {
    method: "POST",
    session: true,
    keepalive,
    body: { events },
  }).catch(() => undefined);
}
