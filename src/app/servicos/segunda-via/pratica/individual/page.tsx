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

export const metadata: Metadata = { title: "Agora, tente você" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="PRÁTICA INDIVIDUAL"
      title="Agora, tente você"
      intro="Sua tarefa é encontrar a opção de segunda via neste exemplo. Escolha um serviço."
      voiceContext={voiceContext}
      actions={<PracticeChoice guided={false} />}
    >
      <JourneyCard title="Sem dica automática">
        Se precisar, você pode pedir ajuda. Isso não é uma penalidade.
      </JourneyCard>
    </JourneyPage>
  );
}
