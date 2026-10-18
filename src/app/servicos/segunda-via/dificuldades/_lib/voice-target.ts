import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetDificuldades: VoiceTarget = {
  id: "segunda-via.dificuldades",
  label: "Encontrar ajuda para uma dificuldade",
  description: "Orientação para dúvidas de aprendizagem ou bloqueios externos.",
  href: routes.dificuldades,
  contextPrefix: "segunda-via.dificuldades",
  origin: "dificuldades",
};
