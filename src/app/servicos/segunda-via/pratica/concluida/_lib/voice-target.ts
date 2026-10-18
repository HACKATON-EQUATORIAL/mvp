import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetPraticaConcluida: VoiceTarget = {
  id: "segunda-via.pratica-concluida",
  label: "Ver encerramento do treino",
  description:
    "Encerramento demonstrativo e próximos caminhos. Acesso direto não conclui tentativa nem comprova aprendizagem.",
  href: routes["pratica-concluida"],
  contextPrefix: "segunda-via.pratica-concluida",
  origin: "pratica-concluida",
};
