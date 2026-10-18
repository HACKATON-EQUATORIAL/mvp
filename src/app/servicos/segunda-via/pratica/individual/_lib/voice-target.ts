import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetPraticaIndividual: VoiceTarget = {
  id: "segunda-via.pratica-individual",
  label: "Praticar sozinho",
  description:
    "Prática sem dica automática, as mesmas 3 perguntas. Treinar sem ajuda.",
  href: routes["pratica-individual"],
  contextPrefix: "segunda-via.pratica-individual",
  origin: "pratica-individual",
  step: "encontrar",
};
