import type { Metadata } from "next";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import styles from "@/components/layout/journey.module.css";
import { JourneyCard } from "@/components/layout/journey-card";
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

export const metadata: Metadata = { title: "Entenda o caminho" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="EXPLICAÇÃO / VISÃO GERAL"
      title="Entenda o caminho"
      intro="Na prática, você vai reconhecer a opção de segunda via e conferir o resultado."
      voiceContext={voiceContext}
      actions={
        <>
          <ActionLink href="#explicacao">Ler explicação</ActionLink>
          <ActionLink variant="primary" href={routes["pratica-guiada"]}>
            Praticar agora
          </ActionLink>
          <ActionLink href={routes.preparacao}>Voltar</ActionLink>
        </>
      }
    >
      <div id="explicacao" tabIndex={-1} className={styles.content}>
        <JourneyCard title="1. Encontrar o serviço">
          Localize a opção correspondente à sua necessidade.
        </JourneyCard>
        <JourneyCard title="2. Conferir o resultado">
          Verifique se chegou à conta que pretendia obter.
        </JourneyCard>
        <p>
          Este caminho é ilustrativo. As opções e os passos reais dependem do
          canal oficial, ainda a confirmar.
        </p>
      </div>
    </JourneyPage>
  );
}
