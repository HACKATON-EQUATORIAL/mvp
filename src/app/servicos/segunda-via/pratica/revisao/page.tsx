import type { Metadata } from "next";
import { PracticeSession } from "@/app/servicos/segunda-via/_components/practice-session";
import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.pratica-revisao",
  description:
    "Revisão só com as perguntas erradas antes. Posso abrir as lições ou voltar à trilha.",
  suggestions: [
    {
      id: "lesson",
      label: "Lição: conferir a conta",
      confirmation: "Você quer abrir a lição sobre conferir a conta.",
      href: `${routes.etapas}/conferir`,
    },
    {
      id: "track",
      label: "Ver a trilha",
      confirmation: "Você quer voltar ao mapa da trilha.",
      href: routes.preparacao,
    },
  ],
};

export const metadata: Metadata = { title: "Revisar o que errei" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="REVISÃO"
      title="Revise o que você errou"
      intro="Só as perguntas que deram trabalho, com dica e explicação. Errar aqui também não custa nada."
      voiceContext={voiceContext}
      actions={null}
    >
      <PracticeSession mode="guided" review />
    </JourneyPage>
  );
}
