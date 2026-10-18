import type { VoiceTarget } from "@/lib/assistant/journey";
import { routes } from "./navigation";
import { PARTS, partHref } from "./steps";

// Telas da jornada de segunda via que o assistente pode abrir. Descrições usam
// as palavras que as pessoas falam (WhatsApp, Clara, CPF, fatura, mês).
export const secondCopyTargets: VoiceTarget[] = [
  {
    id: "segunda-via.canal",
    label: "Escolher o canal",
    description:
      "Escolher por qual canal aprender a segunda via: WhatsApp da Clara (disponível) ou site (em breve).",
    href: routes.canal,
  },
  {
    id: "segunda-via.whatsapp",
    label: "Ver as etapas do WhatsApp",
    description:
      "Mapa do aprendizado da segunda via pelo WhatsApp: ver como funciona, praticar por partes e fazer tudo sozinho. Progresso, energia e selos.",
    href: routes.whatsapp,
  },
  {
    id: "segunda-via.demonstracao",
    label: "Ver como funciona",
    description:
      "Etapa 1: demonstração da conversa com a Clara no WhatsApp, que toca sozinha e é explicada pelo Eletriquinho.",
    href: routes.demonstracao,
  },
  ...PARTS.map((part, index) => ({
    id: `segunda-via.parte.${part.slug}`,
    label: `Praticar: ${part.label.toLocaleLowerCase("pt-BR")}`,
    description: `Etapa 2, parte ${index + 1}: ${
      [
        "escolher “Segunda via da fatura” no menu da Clara",
        "enviar o CPF ou CNPJ do titular (nunca senha)",
        "escolher a fatura pelo mês de referência (setembro é 09)",
        "conferir mês e identificação antes de pagar pelo link",
      ][index]
    }.`,
    href: partHref(part.slug),
  })),
  {
    id: "segunda-via.simulacao",
    label: "Fazer tudo sozinho",
    description:
      "Etapa 3: a conversa inteira com a Clara, sem dica automática. No fim, abrir o WhatsApp oficial para tirar a segunda via de verdade.",
    href: routes.simulacao,
  },
];
