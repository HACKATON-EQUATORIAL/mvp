import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetCanal: VoiceTarget = {
  id: "segunda-via.canal",
  label: "Ir ao canal oficial",
  description:
    "Fazer o pedido real no atendimento digital da Equatorial (Agência Virtual, aplicativo, WhatsApp): requisitos e saída do treino.",
  href: routes.canal,
  contextPrefix: "segunda-via.canal",
  origin: undefined,
};
