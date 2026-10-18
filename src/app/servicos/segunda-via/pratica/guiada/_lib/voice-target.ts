import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetPraticaGuiada: VoiceTarget = {
  id: "segunda-via.pratica-guiada",
  label: "Praticar com apoio",
  description:
    "Prática com dicas e explicação: 3 perguntas sobre encontrar a segunda via e conferir o mês da conta. Começar a praticar.",
  href: routes["pratica-guiada"],
  contextPrefix: "segunda-via.pratica-guiada",
  origin: "pratica-guiada",
  step: "encontrar",
};
