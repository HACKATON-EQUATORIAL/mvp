import type { Metadata } from "next";
import { ChannelSimulator } from "@/app/servicos/segunda-via/_components/channel-simulator";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.simulador",
  description:
    "Simulação do atendimento digital da Equatorial (site e WhatsApp da Clara) com dados de exemplo. Posso abrir o canal oficial ou a trilha.",
  suggestions: [
    {
      id: "channel",
      label: "Ir ao canal oficial",
      confirmation: "Você quer ver como continuar no canal oficial.",
      href: withContext(routes.canal, { origem: "preparacao" }),
    },
    {
      id: "track",
      label: "Ver a trilha",
      confirmation: "Você quer voltar ao mapa da trilha.",
      href: routes.preparacao,
    },
  ],
};

export const metadata: Metadata = { title: "Treine no canal oficial" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="SIMULADOR DO ATENDIMENTO DIGITAL"
      title="Treine no canal antes de usar"
      intro="Faça o caminho completo como no atendimento digital da Equatorial, com dados de exemplo. Escolha o canal que você prefere."
      voiceContext={voiceContext}
      actions={null}
    >
      <ChannelSimulator />
    </JourneyPage>
  );
}
