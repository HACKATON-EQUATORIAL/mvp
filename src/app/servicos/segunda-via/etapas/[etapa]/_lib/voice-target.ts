import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const stepTargets: VoiceTarget[] = [
  {
    id: "segunda-via.etapa.encontrar",
    label: "Consultar como encontrar o serviço",
    description: "Página de explicação da etapa encontrar o serviço.",
    href: `${routes.etapas}/encontrar`,
    contextPrefix: "segunda-via.etapa.encontrar",
    origin: "etapas",
    step: "encontrar",
  },
  {
    id: "segunda-via.etapa.conferir",
    label: "Consultar como conferir o resultado",
    description: "Página de explicação da etapa conferir o resultado.",
    href: `${routes.etapas}/conferir`,
    contextPrefix: "segunda-via.etapa.conferir",
    origin: "etapas",
    step: "conferir",
  },
];
