import type { Metadata } from "next";
import { ChannelChoice } from "@/app/servicos/segunda-via/_components/channel-choice";
import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";
import { CHANNEL_INTRO } from "@/lib/tts/fixed-phrases";

const voiceContext: VoicePageContext = {
  id: "segunda-via.canal",
  description:
    "Escolha do canal para treinar a segunda via: WhatsApp de treino (disponível) ou site (em breve). É simulado; nada vai para a Equatorial de verdade.",
  tip: CHANNEL_INTRO,
  screen: {
    stage: "canal",
    teaches:
      "Escolher onde treinar a segunda via. É um treino simulado: nada vai para a Equatorial de verdade. Só o WhatsApp está disponível; o site da Agência Virtual vem em breve. No fim do treino, dá para abrir o WhatsApp oficial.",
  },
  suggestions: [
    {
      id: "whatsapp",
      label: "Treinar no WhatsApp",
      confirmation: "Você quer treinar a segunda via no WhatsApp?",
      href: routes.whatsapp,
    },
  ],
};

export const metadata: Metadata = { title: "Segunda via: escolha o canal" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="TREINO · SEGUNDA VIA"
      title="Por onde você quer aprender?"
      intro="Primeiro você treina aqui, sem risco. No fim, se quiser, a gente abre o WhatsApp oficial da Equatorial para você fazer de verdade."
      voiceContext={voiceContext}
      actions={null}
      back={{ href: routes.inicio, label: "Voltar aos serviços" }}
    >
      <ChannelChoice />
    </JourneyPage>
  );
}
