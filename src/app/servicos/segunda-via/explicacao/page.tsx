import type { Metadata } from "next";
import { TrackOverview } from "@/app/servicos/segunda-via/_components/track-overview";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.explicacao",
  description: "Posso levar você à prática ou abrir a consulta de uma etapa.",
  suggestions: [
    {
      id: "practice",
      label: "Praticar agora",
      confirmation: "Você quer iniciar a prática guiada.",
      href: routes["pratica-guiada"],
    },
    {
      id: "find-step",
      label: "Consultar uma etapa",
      confirmation: "Você quer escolher uma etapa para consultar.",
      href: withContext(routes.etapas, { origem: "explicacao" }),
    },
  ],
};

export const metadata: Metadata = { title: "O caminho em duas etapas" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="VISÃO GERAL"
      title="O caminho em duas etapas"
      intro="Primeiro você encontra o serviço certo. Depois confere se a conta é a que você procura."
      voiceContext={voiceContext}
      actions={
        <>
          <ActionLink href={routes["pratica-guiada"]}>
            Já entendi, quero praticar
          </ActionLink>
          <ActionLink href={routes.preparacao}>Ver a trilha</ActionLink>
        </>
      }
    >
      <TrackOverview mode="learn" />
    </JourneyPage>
  );
}
