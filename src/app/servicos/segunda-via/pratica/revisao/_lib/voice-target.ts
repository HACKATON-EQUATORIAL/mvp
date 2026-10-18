import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetPraticaRevisao: VoiceTarget = {
  id: "segunda-via.pratica-revisao",
  label: "Revisar o que errei",
  description:
    "Revisão rápida só com as perguntas que a pessoa errou na prática. Não dá respostas.",
  href: routes.revisao,
  contextPrefix: "segunda-via.pratica-revisao",
  origin: "pratica-guiada",
};
