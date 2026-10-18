import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetEtapas: VoiceTarget = {
  id: "segunda-via.etapas",
  label: "Tirar uma dúvida rápida",
  description:
    "Consulta rápida: escolher uma das etapas (encontrar o serviço ou conferir a conta) sem fazer a trilha toda.",
  href: routes.etapas,
  contextPrefix: "segunda-via.etapas",
  origin: "etapas",
};
