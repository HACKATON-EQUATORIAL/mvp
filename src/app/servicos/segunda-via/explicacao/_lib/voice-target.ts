import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetExplicacao: VoiceTarget = {
  id: "segunda-via.explicacao",
  label: "Ver explicação geral",
  description:
    "Visão geral do caminho: encontrar o serviço e conferir o resultado.",
  href: routes.explicacao,
  contextPrefix: "segunda-via.explicacao",
  origin: "explicacao",
};
