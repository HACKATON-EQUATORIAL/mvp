import type { Metadata } from "next";
import { ChannelChoice } from "@/app/servicos/segunda-via/_components/channel-choice";
import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.canal",
  description:
    "Escolha do canal para aprender a segunda via: WhatsApp da Clara (disponível) ou site (em breve).",
  tip: "Por onde você quer aprender? O WhatsApp da Clara já está pronto.",
  suggestions: [
    {
      id: "whatsapp",
      label: "Aprender pelo WhatsApp",
      confirmation: "Você quer aprender a segunda via pelo WhatsApp?",
      href: routes.whatsapp,
    },
  ],
};

export const metadata: Metadata = { title: "Segunda via: escolha o canal" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="SERVIÇO · SEGUNDA VIA"
      title="Por onde você quer aprender?"
      intro="Escolha o canal. Você vai ver como funciona, praticar e depois fazer de verdade."
      voiceContext={voiceContext}
      actions={null}
    >
      <ChannelChoice />
    </JourneyPage>
  );
}
