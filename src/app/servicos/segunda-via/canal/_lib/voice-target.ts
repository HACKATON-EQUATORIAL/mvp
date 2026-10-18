import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetCanal: VoiceTarget = {
  id: "segunda-via.canal",
  label: "Consultar informações do canal",
  description:
    "Página interna sobre limites e canal oficial. Destino externo ainda não confirmado.",
  href: routes.canal,
  contextPrefix: "segunda-via.canal",
  origin: undefined,
};
