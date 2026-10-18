import type { Metadata } from "next";
import { WhatsAppSimulation } from "@/app/servicos/segunda-via/_components/whatsapp-simulation";
import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import { PARTS, partHref } from "@/app/servicos/segunda-via/_lib/steps";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.simulacao",
  description:
    "Etapa 3: a conversa inteira com a Clara, sem dica automática. No fim, abre o WhatsApp oficial com a mensagem pronta.",
  tip: "Agora é com você. Se precisar, toque em mim: não tem penalidade.",
  screen: {
    stage: "etapa3",
    teaches:
      "Conversa inteira com a Clara, do menu até conferir a fatura, sem dica automática. Ao terminar, segue para a conclusão.",
  },
  suggestions: [
    {
      id: "map",
      label: "Ver as etapas",
      confirmation: "Você quer voltar ao mapa das etapas?",
      href: routes.whatsapp,
    },
  ],
};

export const metadata: Metadata = { title: "Etapa 3: faça tudo sozinho" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="ETAPA 3 DE 3 · FAÇA TUDO SOZINHO"
      title="Converse com a Clara"
      intro="Faça a conversa inteira, do menu até conferir a fatura."
      voiceContext={voiceContext}
      actions={null}
      back={{ href: routes.whatsapp, label: "Voltar às etapas" }}
      previous={{
        href: partHref(PARTS[PARTS.length - 1].slug),
        label: `Voltar à parte ${PARTS.length}`,
      }}
    >
      <WhatsAppSimulation />
    </JourneyPage>
  );
}
