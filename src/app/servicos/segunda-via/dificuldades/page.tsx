import type { Metadata } from "next";
import { Suspense } from "react";
import { ActionLink } from "@/app/_components/action-link";
import styles from "@/app/_components/layout/journey.module.css";
import { JourneyPage } from "@/app/_components/layout/journey-page";
import { JourneyCard } from "@/app/servicos/segunda-via/_components/journey-card";
import {
  readContext,
  returnTo,
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";

export const metadata: Metadata = { title: "Onde você encontrou dificuldade?" };

export default function Page({
  searchParams,
}: PageProps<"/servicos/segunda-via/dificuldades">) {
  return (
    <JourneyPage
      eyebrow="TENTATIVA BLOQUEADA"
      title="Onde você encontrou dificuldade?"
      intro="Uma dúvida sobre o procedimento é diferente de um problema de acesso ao canal."
      actions={
        <Suspense fallback={<p role="status">Preparando a navegação…</p>}>
          <PageActions searchParams={searchParams} />
        </Suspense>
      }
    >
      <JourneyCard title="Se o canal não funciona">
        Este ambiente não corrige códigos de acesso, carregamento ou
        autorização. Use somente orientações oficiais confirmadas.
      </JourneyCard>
    </JourneyPage>
  );
}

async function PageActions({
  searchParams,
}: Pick<PageProps<"/servicos/segunda-via/dificuldades">, "searchParams">) {
  const context = readContext(await searchParams);
  return (
    <>
      <ActionLink variant="primary" href={withContext(routes.etapas, context)}>
        Não sei qual opção escolher
      </ActionLink>
      <ActionLink href={routes.explicacao}>
        Não entendi o procedimento
      </ActionLink>
      <details className={styles.details}>
        <summary>Código ou página não funciona</summary>
        <p>
          Este ambiente não consegue verificar ou corrigir o acesso ao canal.
          Procure as orientações de ajuda do próprio canal oficial. Não informe
          códigos ou dados pessoais nesta prática.
        </p>
      </details>
      <ActionLink href={returnTo(context, "dificuldades", "/")}>
        Voltar
      </ActionLink>
    </>
  );
}
