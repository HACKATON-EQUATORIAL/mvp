import type { Metadata } from "next";
import styles from "@/app/_components/layout/journey.module.css";
import { JourneyPage } from "@/app/_components/layout/journey-page";
import { JourneyCard } from "@/app/servicos/segunda-via/_components/journey-card";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { ActionLink } from "@/components/ui/action-link";

export const metadata: Metadata = { title: "Confira o resultado" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="PRÁTICA GUIADA"
      title="Confira o resultado"
      intro="Neste exemplo, a conta está disponível. Confira as informações antes de continuar."
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
