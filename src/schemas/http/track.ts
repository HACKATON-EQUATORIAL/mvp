import { z } from "zod";

export const trackSummarySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(["available", "coming_soon"]),
  content_version: z.number().int().positive().nullable(),
});
export const trackListSchema = z.array(trackSummarySchema);
const stepSummarySchema = z.object({
  id: z.string(),
  order: z.number().int().positive(),
  title: z.string(),
  consult_title: z.string(),
});
export const trackDetailSchema = trackSummarySchema.extend({
  demonstrative: z.boolean(),
  objective: z.string().nullable(),
  simulated_notice: z.string().nullable(),
  steps: z.array(stepSummarySchema),
});
export const stepDetailSchema = stepSummarySchema.extend({
  track_id: z.string(),
  content_version: z.number().int().positive(),
  explanation: z.object({
    text: z.string(),
    image: z.object({ src: z.string(), alt: z.string() }).nullable(),
  }),
  next_actions: z.array(
    z.object({
      kind: z.enum([
        "next_step",
        "previous_step",
        "practice",
        "consult",
        "channel_exit",
      ]),
      label: z.string(),
      step_id: z.string().nullable(),
    }),
  ),
});
export const difficultyListSchema = z.object({
  track_id: z.string(),
  content_version: z.number().int().positive(),
  items: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      classification: z.enum(["teachable", "external_block"]),
      guidance: z.string(),
      destination: z.object({
        kind: z.enum(["step", "overview", "channel_exit"]),
        step_id: z.string().nullable(),
      }),
    }),
  ),
});
export type TrackSummary = z.infer<typeof trackSummarySchema>;
export type TrackDetail = z.infer<typeof trackDetailSchema>;
export type StepDetail = z.infer<typeof stepDetailSchema>;
export type DifficultyList = z.infer<typeof difficultyListSchema>;
