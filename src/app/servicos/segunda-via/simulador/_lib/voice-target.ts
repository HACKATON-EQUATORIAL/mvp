import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetSimulador: VoiceTarget = {
  id: "segunda-via.simulador",
  label: "Treinar no canal simulado",
  description:
    "Simulação guiada do atendimento digital real da Equatorial: Agência Virtual (site, Pagamento Simplificado) e WhatsApp da Clara, com dados de exemplo.",
  href: routes.simulador,
  contextPrefix: "segunda-via.simulador",
  origin: "preparacao",
};
