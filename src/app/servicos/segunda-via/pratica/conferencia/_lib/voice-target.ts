import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetPraticaConferencia: VoiceTarget = {
  id: "segunda-via.pratica-conferencia",
  label: "Ver conferência",
  description:
    "Tela demonstrativa de conferência. Acesso direto não comprova realização da prática.",
  href: routes["pratica-conferencia"],
  contextPrefix: "segunda-via.pratica-conferencia",
  origin: "pratica-conferencia",
  step: "conferir",
};
