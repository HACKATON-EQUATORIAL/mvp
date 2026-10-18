import { z } from "zod";
import { apiRequest } from "@/http/api";

// Eventos de navegação aceitos por POST /events (sem texto livre). Envio é
// melhor-esforço: falhas não interrompem a jornada.
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

const acceptedSchema = z.object({ accepted: z.number() });

export function postEvent(event: NavigationEvent, trackId = "segunda-via") {
  void apiRequest("events", acceptedSchema, {
    method: "POST",
    session: true,
    body: {
      events: [
        {
          ...event,
          event_id: crypto.randomUUID(),
          track_id: trackId,
          occurred_at: new Date().toISOString(),
        },
      ],
    },
  }).catch(() => undefined);
}
