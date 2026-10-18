import type { Step } from "./navigation";

export const TRACK_ID = "segunda-via";

// As URLs mantêm os aliases curtos; a API usa os IDs do conteúdo versionado.
// A tradução acontece só aqui, nunca no transporte HTTP.
export const apiStepIds: Record<Step, string> = {
  encontrar: "encontrar-servico",
  conferir: "conferir-resultado",
};

export function localStep(apiStepId: string | null | undefined): Step | null {
  const entry = Object.entries(apiStepIds).find(([, id]) => id === apiStepId);
  return entry ? (entry[0] as Step) : null;
}
