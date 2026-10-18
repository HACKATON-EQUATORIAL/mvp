import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetPraticaConcluida: VoiceTarget = {
  id: "segunda-via.pratica-concluida",
  label: "Ver meu resultado",
  description:
    "Resultado da prática individual e próximo passo. Abrir não conclui nem registra a prática.",
  href: routes["pratica-concluida"],
  contextPrefix: "segunda-via.pratica-concluida",
  origin: "pratica-concluida",
};
