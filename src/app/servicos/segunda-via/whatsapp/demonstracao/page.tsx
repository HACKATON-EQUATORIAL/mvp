import type { Metadata } from "next";
import { DemoScene } from "@/app/servicos/segunda-via/_components/demo-scene";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.demonstracao",
  description:
    "Etapa 1: a conversa com a Clara toca sozinha e o Eletriquinho explica cada passo. Dá para pausar, voltar e repetir.",
  tip: "Assista: eu explico cada passo da conversa.",
  suggestions: [],
};

export const metadata: Metadata = { title: "Etapa 1: veja como funciona" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="ETAPA 1 DE 3 · VEJA COMO FUNCIONA"
      title="A conversa com a Clara"
      intro="É só assistir. A conversa anda sozinha e eu explico cada passo."
      voiceContext={voiceContext}
      actions={null}
    >
      <DemoScene />
    </JourneyPage>
  );
}
