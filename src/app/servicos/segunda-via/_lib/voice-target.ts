import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetPreparacao: VoiceTarget = {
  id: "segunda-via.preparacao",
  label: "Conhecer a trilha",
  description:
    "Apresentação do objetivo e dos limites do treino demonstrativo.",
  href: routes.preparacao,
  contextPrefix: "segunda-via.preparacao",
  origin: "preparacao",
};
