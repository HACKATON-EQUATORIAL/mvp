import type { Metadata } from "next";
import { PracticeChat } from "@/app/servicos/segunda-via/_components/practice-chat";
import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.simulacao",
  description:
    "Etapa 3: a conversa inteira com a Clara, sem dica automática. No fim, abre o WhatsApp oficial com a mensagem pronta.",
  tip: "Agora é com você. Se precisar, peça ajuda: não tem penalidade.",
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
    >
      <PracticeChat />
    </JourneyPage>
  );
}
