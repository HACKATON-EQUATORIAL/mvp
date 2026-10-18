import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetPraticaIndividual: VoiceTarget = {
  id: "segunda-via.pratica-individual",
  label: "Abrir prática individual",
  description:
    "Exercício de escolha com menos ajuda. Abrir não responde o exercício.",
  href: routes["pratica-individual"],
  contextPrefix: "segunda-via.pratica-individual",
  origin: "pratica-individual",
  step: "encontrar",
};
