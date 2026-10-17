import type { Metadata } from "next";
import { PracticeChoice } from "@/app/servicos/segunda-via/_components/practice-choice";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyCard } from "@/components/layout/journey-card";
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

export const metadata: Metadata = { title: "Vamos praticar" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="PRÁTICA GUIADA"
      title="Vamos praticar"
      intro="Você precisa de outra via da conta. Qual serviço escolheria?"
      voiceContext={voiceContext}
      actions={<PracticeChoice guided />}
    >
      <JourneyCard title="Dica disponível">
        Procure o nome do serviço que corresponde à tarefa. Este é um exemplo de
        prática, sem dados reais.
      </JourneyCard>
    </JourneyPage>
  );
}
