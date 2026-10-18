import { z } from "zod";

export const practiceModeSchema = z.enum(["guided", "independent"]);
export const helpKindSchema = z.enum([
  "hint",
  "explanation",
  "accessibility",
  "voice",
]);

// Espelha AttemptState do backend; o gabarito nunca vem nesta resposta.
export const attemptStateSchema = z.object({
  attempt_id: z.uuid(),
  track_id: z.string(),
  content_version: z.number().int().positive(),
  mode: practiceModeSchema,
  status: z.enum(["in_progress", "completed", "abandoned"]),
  current_item: z
    .object({
      id: z.string(),
      step_id: z.string(),
      prompt: z.string(),
      options: z.array(z.object({ id: z.string(), label: z.string() })),
      hint_available: z.boolean(),
    })
    .nullable(),
  progress: z.object({
    current: z.number().int().nonnegative(),
    total: z.number().int().positive(),
  }),
  last_feedback: z
    .object({ is_expected: z.boolean(), message: z.string() })
    .nullable(),
  assisted: z.boolean(),
  outcome_label: z.string().nullable(),
});

export const helpResponseSchema = z.object({
  kind: helpKindSchema,
  content: z.string(),
  attempt: attemptStateSchema,
});

export type PracticeMode = z.infer<typeof practiceModeSchema>;
export type HelpKind = z.infer<typeof helpKindSchema>;
export type AttemptState = z.infer<typeof attemptStateSchema>;
export type HelpResponse = z.infer<typeof helpResponseSchema>;
