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
  id: "segunda-via.pratica-conferencia",
  description: "Posso explicar esta etapa ou levar você de volta à prática.",
  suggestions: [
    {
      id: "explain",
      label: "Explicação de conferência",
      confirmation: "Você quer consultar como conferir o resultado.",
      href: withContext(`${routes.etapas}/conferir`, {
        origem: "pratica-conferencia",
        etapa: "conferir",
      }),
    },
    {
      id: "practice",
      label: "Voltar à prática",
      confirmation: "Você quer voltar à prática guiada.",
      href: routes["pratica-guiada"],
    },
  ],
};

export const metadata: Metadata = { title: "Confira o resultado" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="PRÁTICA GUIADA"
      title="Confira o resultado"
      intro="Neste exemplo, a conta está disponível. Confira as informações antes de continuar."
      voiceContext={voiceContext}
      actions={
        <>
          <ActionLink variant="primary" href={routes["pratica-individual"]}>
            Entendi, quero tentar
          </ActionLink>
          <ActionLink
            href={withContext(`${routes.etapas}/conferir`, {
              origem: "pratica-conferencia",
              etapa: "conferir",
            })}
          >
            Preciso de uma explicação
          </ActionLink>
          <ActionLink href={routes["pratica-guiada"]}>
            Voltar à prática
          </ActionLink>
        </>
      }
    >
      <JourneyCard title="Conta para prática">
        <p>
          Confira o período e a identificação da conta antes de utilizar a
          segunda via.
        </p>
        <dl className={styles.example}>
          <div>
            <dt>Período:</dt>
            <dd>Outubro de 2026</dd>
          </div>
          <div>
            <dt>Identificação:</dt>
            <dd>CONTA EXEMPLO</dd>
          </div>
        </dl>
        <p>Informações fictícias, sem valor de cobrança.</p>
      </JourneyCard>
      <JourneyCard title="O que observar">
        No serviço real, confira as informações relevantes antes de utilizar o
        documento.
      </JourneyCard>
    </JourneyPage>
  );
}
