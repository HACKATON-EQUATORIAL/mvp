import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetExplicacao: VoiceTarget = {
  id: "segunda-via.explicacao",
  label: "Ver o caminho completo",
  description:
    "Visão geral do processo de segunda via em duas etapas: encontrar o serviço e conferir a conta.",
  href: routes.explicacao,
  contextPrefix: "segunda-via.explicacao",
  origin: "explicacao",
};
