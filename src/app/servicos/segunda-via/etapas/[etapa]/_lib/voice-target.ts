import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const stepTargets: VoiceTarget[] = [
  {
    id: "segunda-via.etapa.encontrar",
    label: "Lição: encontrar o serviço",
    description:
      "Lição: onde fica a opção Segunda via no menu de serviços e como diferenciar de Consultar débitos.",
    href: `${routes.etapas}/encontrar`,
    contextPrefix: "segunda-via.etapa.encontrar",
    origin: "etapas",
    step: "encontrar",
  },
  {
    id: "segunda-via.etapa.conferir",
    label: "Lição: conferir a conta",
    description:
      "Lição: como identificar o mês de referência da fatura e a identificação da conta (é a conta certa?).",
    href: `${routes.etapas}/conferir`,
    contextPrefix: "segunda-via.etapa.conferir",
    origin: "etapas",
    step: "conferir",
  },
];
