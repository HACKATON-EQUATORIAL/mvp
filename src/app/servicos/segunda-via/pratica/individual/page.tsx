import type { Metadata } from "next";
import { PracticeSession } from "@/app/servicos/segunda-via/_components/practice-session";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.pratica-individual",
  description: "Você pode consultar a explicação da etapa ou voltar ao início.",
  suggestions: [
    {
      id: "explain",
      label: "Consultar como encontrar",
      confirmation:
        "Você quer ver a explicação sobre como encontrar segunda via.",
      href: withContext(`${routes.etapas}/encontrar`, {
        origem: "pratica-individual",
        etapa: "encontrar",
      }),
    },
    {
      id: "home",
      label: "Voltar ao início",
      confirmation: "Você quer voltar à tela inicial.",
      href: routes.inicio,
    },
  ],
};

export const metadata: Metadata = { title: "Agora, tente sozinho" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="PRÁTICA INDIVIDUAL"
      title="Agora, tente sozinho"
      intro="As mesmas 3 perguntas, sem dica automática. Se precisar, peça ajuda na própria tela."
      voiceContext={voiceContext}
      actions={null}
    >
      <PracticeSession mode="independent" />
    </JourneyPage>
  );
}
