import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoiceTarget } from "@/lib/assistant/journey";

export const targetPraticaConferencia: VoiceTarget = {
  id: "segunda-via.pratica-conferencia",
  label: "Ver a conta de exemplo",
  description:
    "Conta de exemplo DEMO-001: onde ficam a identificação, o mês de referência (09/2026) e o valor da fatura.",
  href: routes["pratica-conferencia"],
  contextPrefix: "segunda-via.pratica-conferencia",
  origin: "pratica-conferencia",
  step: "conferir",
};
