import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetEtapas: VoiceTarget = {
  id: "segunda-via.etapas",
  label: "Escolher uma etapa",
  description: "Lista das duas etapas que podem ser consultadas separadamente.",
  href: routes.etapas,
  contextPrefix: "segunda-via.etapas",
  origin: "etapas",
};
