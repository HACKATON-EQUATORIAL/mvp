import { z } from "zod";

export const base = "/servicos/segunda-via";
export const routes = {
  inicio: "/",
  preparacao: base,
  explicacao: `${base}/explicacao`,
  "pratica-guiada": `${base}/pratica/guiada`,
  "pratica-conferencia": `${base}/pratica/conferencia`,
  "pratica-individual": `${base}/pratica/individual`,
  "pratica-concluida": `${base}/pratica/concluida`,
  etapas: `${base}/etapas`,
  dificuldades: `${base}/dificuldades`,
  canal: `${base}/canal`,
} as const;

export const stepSchema = z.enum(["encontrar", "conferir"]);
const originSchema = z.enum([
  "inicio",
  "preparacao",
  "explicacao",
  "pratica-guiada",
  "pratica-conferencia",
  "pratica-individual",
  "pratica-concluida",
  "etapas",
  "dificuldades",
]);
const contextSchema = z.object({
  origem: originSchema.optional().catch(undefined),
  etapa: stepSchema.optional().catch(undefined),
});
export const stepParamsSchema = z.object({ etapa: stepSchema });
export type Step = z.infer<typeof stepSchema>;
export type NavigationContext = z.infer<typeof contextSchema>;

export function readContext(value: unknown): NavigationContext {
  const result = contextSchema.safeParse(value);
  return result.success ? result.data : {};
}

export function withContext(path: string, context: NavigationContext): string {
  const query = new URLSearchParams();
  if (context.origem) query.set("origem", context.origem);
  if (context.etapa) query.set("etapa", context.etapa);
  return query.size ? `${path}?${query}` : path;
}

export function returnTo(
  context: NavigationContext,
  current: "etapas" | "dificuldades" | "canal" | "ajuda",
  fallback: string,
): string {
  // Intermediate pages never become each other's return destination.
  if (
    !context.origem ||
    context.origem === current ||
    ((current === "etapas" || current === "dificuldades") &&
      (context.origem === "etapas" || context.origem === "dificuldades"))
  )
    return fallback;
  return withContext(routes[context.origem], { etapa: context.etapa });
}
