import type { Metadata } from "next";
import { PracticeSession } from "@/app/servicos/segunda-via/_components/practice-session";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.pratica-guiada",
  description: "Posso mostrar a explicação da etapa ou voltar ao início.",
  suggestions: [
    {
      id: "explain",
      label: "Consultar como encontrar",
      confirmation:
        "Você quer ver a explicação sobre como encontrar segunda via.",
      href: withContext(`${routes.etapas}/encontrar`, {
        origem: "pratica-guiada",
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

export const metadata: Metadata = { title: "Vamos praticar com apoio" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="PRÁTICA COM APOIO"
      title="Vamos praticar com apoio"
      intro="Responda 3 perguntas com uma conta de exemplo. Se errar, a explicação aparece e você tenta de novo."
      voiceContext={voiceContext}
      actions={null}
    >
      <PracticeSession mode="guided" />
    </JourneyPage>
  );
}
