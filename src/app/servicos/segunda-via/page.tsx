import type { Metadata } from "next";
import { TrackRoadmap } from "@/app/servicos/segunda-via/_components/track-roadmap";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.preparacao",
  description:
    "Mapa da trilha: duas lições, prática com apoio, prática sozinho e, por fim, o canal oficial. Posso começar a primeira lição ou abrir a prática.",
  suggestions: [
    {
      id: "first-lesson",
      label: "Começar a primeira lição",
      confirmation: "Você quer abrir a lição sobre como encontrar o serviço.",
      href: `${routes.etapas}/encontrar`,
    },
    {
      id: "practice",
      label: "Praticar com apoio",
      confirmation: "Você quer iniciar a prática com apoio.",
      href: routes["pratica-guiada"],
    },
    {
      id: "steps",
      label: "Tirar uma dúvida",
      confirmation: "Você quer escolher uma etapa para consultar.",
      href: withContext(routes.etapas, { origem: "preparacao" }),
    },
  ],
};

export const metadata: Metadata = {
  title: "Aprenda a obter outra via da conta",
};

export default function Page() {
  return (
    <JourneyPage
      eyebrow="TRILHA · SEGUNDA VIA"
      title="Aprenda a obter outra via da conta"
      intro="Siga os passos no seu ritmo: aprenda, pratique com apoio e depois tente sozinho."
      voiceContext={voiceContext}
      actions={null}
    >
      <TrackRoadmap />
    </JourneyPage>
  );
}
