import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetPreparacao: VoiceTarget = {
  id: "segunda-via.preparacao",
  label: "Conhecer a trilha",
  description:
    "Mapa da trilha de segunda via (outra via da conta): lições, práticas, progresso e meta no canal oficial. Começar a aprender.",
  href: routes.preparacao,
  contextPrefix: "segunda-via.preparacao",
  origin: "preparacao",
};
