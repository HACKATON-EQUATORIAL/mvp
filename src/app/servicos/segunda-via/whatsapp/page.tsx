import type { Metadata } from "next";
import { TrackRoadmap } from "@/app/servicos/segunda-via/_components/track-roadmap";
import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.whatsapp",
  description:
    "Mapa da segunda via pelo WhatsApp em 3 etapas: ver como funciona, praticar parte por parte e fazer tudo sozinho.",
  tip: "São 3 etapas: ver, praticar e fazer sozinho. Toque em mim se precisar.",
  suggestions: [
    {
      id: "demo",
      label: "Ver como funciona",
      confirmation: "Você quer ver a demonstração da conversa com a Clara?",
      href: routes.demonstracao,
    },
    {
      id: "full",
      label: "Fazer tudo sozinho",
      confirmation: "Você quer fazer a conversa inteira sozinho?",
      href: routes.simulacao,
    },
  ],
};

export const metadata: Metadata = { title: "Segunda via pelo WhatsApp" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="SEGUNDA VIA · WHATSAPP"
      title="Segunda via pelo WhatsApp"
      intro="Aprenda a pedir a sua conta à Clara, a assistente da Equatorial, em 3 etapas."
      voiceContext={voiceContext}
      actions={null}
    >
      <TrackRoadmap />
    </JourneyPage>
  );
}
