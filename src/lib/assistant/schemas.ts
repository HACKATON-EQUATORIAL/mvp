import { z } from "zod";

export const MAX_INTERPRET_BYTES = 65_536;
export const INTERPRET_TIMEOUT_MS = 35_000;
export const INTERPRET_PROVIDER_TIMEOUT_MS = 25_000;
export const MAX_CONVERSATION_TURNS = 6;
const idSchema = z.string().trim().min(1).max(120);
export const assistantActionSchema = z
  .object({
    id: idSchema,
    label: z.string().trim().min(1).max(200),
    confirmation: z.string().trim().min(1).max(500),
    description: z.string().trim().min(1).max(500),
  })
  .strict();
export const interpretationResultSchema = z
  .object({
    type: z.enum([
      "information",
      "help",
      "clarification",
      "proposal",
      "confirmation",
      "confirmation_request",
      "cancellation",
      "out_of_scope",
    ]),
    message: z.string().trim().min(1).max(1200),
    showCatalog: z.boolean(),
    optionIds: z.array(idSchema).max(3),
    actionId: idSchema.nullable(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const needsAction =
      data.type === "proposal" ||
      data.type === "confirmation" ||
      data.type === "confirmation_request";
    const asking = data.type === "confirmation_request";
    if (
      (data.showCatalog && data.type !== "information") ||
      needsAction !== (data.actionId !== null) ||
      new Set(data.optionIds).size !== data.optionIds.length ||
      (needsAction && !asking && data.optionIds.length > 0) ||
      (asking &&
        (data.optionIds.length > 2 ||
          (data.actionId !== null &&
            data.optionIds.includes(data.actionId)))) ||
      (data.type === "clarification" && !data.optionIds.length) ||
      (data.type === "cancellation" && data.optionIds.length > 0) ||
      (data.type === "help" && data.optionIds.length > 2)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Resultado de interpretação inconsistente.",
      });
    }
  });
export const conversationTurnSchema = z
  .object({
    user: z.string().trim().min(1).max(4000),
    assistant: interpretationResultSchema,
  })
  .strict();
export const interpretationRequestSchema = z
  .object({
    text: z.string().trim().min(1).max(4000),
    context: z
      .object({
        id: z.string().trim().min(1).max(200),
        description: z.string().trim().min(1).max(1000),
        suggestions: z
          .array(assistantActionSchema.omit({ description: true }))
          .max(3),
        // Onde a pessoa está e o que a tela ensina.
        screen: z
          .object({
            stage: z.enum([
              "servicos",
              "canal",
              "mapa",
              "etapa1",
              "etapa2",
              "etapa3",
              "conclusao",
              "outra",
            ]),
            part: z.string().trim().max(120).optional(),
            teaches: z.string().trim().min(1).max(600),
          })
          .strict()
          .nullable()
          .default(null),
        // Lição em andamento nesta tela (sem a opção esperada).
        practice: z
          .object({
            mode: z.enum(["demo", "guided", "independent"]),
            current: z.number().int().positive(),
            total: z.number().int().positive(),
            stepTitle: z.string().max(200).optional(),
            prompt: z.string().max(600).optional(),
            hint: z.string().max(600).optional(),
            lesson: z.string().max(800).optional(),
          })
          .strict()
          .nullable()
          .default(null),
      })
      .strict(),
    catalog: z
      .object({
        state: z.enum(["ready", "loading", "error"]),
        tracks: z
          .array(
            z
              .object({
                id: idSchema,
                title: z.string().min(1).max(200),
                status: z.enum(["available", "coming_soon"]),
              })
              .strict(),
          )
          .max(20),
        secondCopy: z
          .object({
            title: z.string().min(1).max(200),
            objective: z.string().max(1000).nullable(),
            steps: z
              .array(
                z.object({ id: idSchema, title: z.string().max(200) }).strict(),
              )
              .max(10),
            difficulties: z
              .array(
                z
                  .object({
                    id: idSchema,
                    label: z.string().max(200),
                    guidance: z.string().max(800).optional(),
                  })
                  .strict(),
              )
              .max(10)
              .default([]),
          })
          .strict()
          .nullable(),
      })
      .strict(),
    actions: z.array(assistantActionSchema).max(32),
    history: z.array(conversationTurnSchema).max(MAX_CONVERSATION_TURNS),
    pendingActionId: idSchema.nullable(),
    presentedOptionIds: z.array(idSchema).max(3),
    // Ações recusadas com "Nada disso" nesta página; não devem voltar.
    rejectedOptionIds: z.array(idSchema).max(32).default([]),
  })
  .strict()
  .superRefine((data, ctx) => {
    const ids = data.actions.map((item) => item.id);
    const allowed = new Set(ids);
    if (
      allowed.size !== ids.length ||
      data.context.suggestions.some((item) => !allowed.has(item.id)) ||
      (data.pendingActionId !== null && !allowed.has(data.pendingActionId)) ||
      data.presentedOptionIds.some((id) => !allowed.has(id)) ||
      data.rejectedOptionIds.some((id) => !allowed.has(id)) ||
      new Set(data.presentedOptionIds).size !== data.presentedOptionIds.length
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Ações de contexto inconsistentes.",
      });
    }
  });
export const interpretationErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});
export type InterpretationRequest = z.infer<typeof interpretationRequestSchema>;
export type InterpretationResult = z.infer<typeof interpretationResultSchema>;
export type ConversationTurn = z.infer<typeof conversationTurnSchema>;
export function matchesAllowedSuggestions(
  result: InterpretationResult,
  request: InterpretationRequest,
) {
  const allowed = new Set(request.actions.map((item) => item.id));
  return (
    result.optionIds.every((id) => allowed.has(id)) &&
    (result.actionId === null || allowed.has(result.actionId)) &&
    (result.type !== "confirmation" ||
      result.actionId === request.pendingActionId) &&
    (result.type !== "cancellation" || request.pendingActionId !== null)
  );
}
