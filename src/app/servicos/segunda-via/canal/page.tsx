import type { Metadata } from "next";
import { Suspense } from "react";
import {
  readContext,
  returnTo,
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import styles from "@/components/layout/journey.module.css";
import { JourneyCard } from "@/components/layout/journey-card";
import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";
import { VoiceHelp } from "@/components/voice/voice-help";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

export const metadata: Metadata = { title: "Continuar no canal oficial" };

export default function Page({
  searchParams,
}: PageProps<"/servicos/segunda-via/canal">) {
  return (
    <JourneyPage
      eyebrow="SAÍDA DO AMBIENTE DE PRÁTICA"
      title="Continuar no canal oficial"
      intro="Esta demonstração termina aqui. O destino e o procedimento no canal oficial ainda precisam ser confirmados."
      voiceSlot={
        <Suspense fallback={null}>
          <PageVoice searchParams={searchParams} />
        </Suspense>
      }
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

async function PageVoice({
  searchParams,
}: Pick<PageProps<"/servicos/segunda-via/canal">, "searchParams">) {
  const context = readContext(await searchParams);
  const voiceContext: VoicePageContext = {
    navigation: context,
    id: `segunda-via.canal.${context.origem ?? "inicio"}.${context.etapa ?? "geral"}`,
    description:
      "O destino oficial ainda não está disponível nesta demonstração.",
    suggestions: [
      {
        id: "return",
        label: "Voltar à orientação",
        confirmation: "Você quer retornar à tela de orientação de onde veio.",
        href: returnTo(context, "canal", routes.etapas),
      },
      {
        id: "steps",
        label: "Escolher uma etapa",
        confirmation: "Você quer consultar uma etapa da orientação.",
        href: withContext(routes.etapas, context),
      },
    ],
  };
  return <VoiceHelp context={voiceContext} />;
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
