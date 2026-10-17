import type { Metadata } from "next";
import { Suspense } from "react";
import styles from "@/app/_components/layout/journey.module.css";
import { JourneyPage } from "@/app/_components/layout/journey-page";
import { JourneyCard } from "@/app/servicos/segunda-via/_components/journey-card";
import {
  readContext,
  returnTo,
  routes,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { ActionLink } from "@/components/ui/action-link";

export const metadata: Metadata = { title: "Continuar no canal oficial" };

export default function Page({
  searchParams,
}: PageProps<"/servicos/segunda-via/canal">) {
  return (
    <JourneyPage
      eyebrow="SAÍDA DO AMBIENTE DE PRÁTICA"
      title="Continuar no canal oficial"
      intro="Esta demonstração termina aqui. O destino e o procedimento no canal oficial ainda precisam ser confirmados."
      actions={
        <Suspense fallback={<p role="status">Preparando a navegação…</p>}>
          <PageActions searchParams={searchParams} />
        </Suspense>
      }
    >
      <JourneyCard title="Destino ainda a confirmar" className={styles.warning}>
        A Agência Virtual Equatorial é a referência proposta. Não há abertura de
        canal externo nesta demonstração.
      </JourneyCard>
      <JourneyCard title="Se houver um bloqueio">
        Se não conseguir acessar o serviço real, consulte as orientações de
        ajuda do próprio canal oficial.
      </JourneyCard>
    </JourneyPage>
  );
}

async function PageActions({
  searchParams,
}: Pick<PageProps<"/servicos/segunda-via/canal">, "searchParams">) {
  const context = readContext(await searchParams);
  return (
    <>
      <ActionLink
        variant="primary"
        href={returnTo(context, "canal", routes.etapas)}
      >
        Voltar à orientação
      </ActionLink>
      <ActionLink href="/">Voltar ao início</ActionLink>
    </>
  );
}
