import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetDificuldades: VoiceTarget = {
  id: "segunda-via.dificuldades",
  label: "Tive um problema",
  description:
    "Ajuda para dificuldades: não sei qual opção escolher, não entendi, site, código ou página do canal oficial não funciona.",
  href: routes.dificuldades,
  contextPrefix: "segunda-via.dificuldades",
  origin: "dificuldades",
};
