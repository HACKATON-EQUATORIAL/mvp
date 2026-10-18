import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetPraticaGuiada: VoiceTarget = {
  id: "segunda-via.pratica-guiada",
  label: "Abrir prática guiada",
  description:
    "Exercício demonstrativo de escolha com ajuda. Abrir não responde o exercício.",
  href: routes["pratica-guiada"],
  contextPrefix: "segunda-via.pratica-guiada",
  origin: "pratica-guiada",
  step: "encontrar",
};
