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

export const metadata: Metadata = { title: "Onde você encontrou dificuldade?" };

export default function Page({
  searchParams,
}: PageProps<"/servicos/segunda-via/dificuldades">) {
  return (
    <JourneyPage
      eyebrow="TENTATIVA BLOQUEADA"
      title="Onde você encontrou dificuldade?"
      intro="Uma dúvida sobre o procedimento é diferente de um problema de acesso ao canal."
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
      <JourneyCard title="Se o canal não funciona">
        Este ambiente não corrige códigos de acesso, carregamento ou
        autorização. Use somente orientações oficiais confirmadas.
      </JourneyCard>
    </JourneyPage>
  );
}

async function PageVoice({
  searchParams,
}: Pick<PageProps<"/servicos/segunda-via/dificuldades">, "searchParams">) {
  const context = readContext(await searchParams);
  const voiceContext: VoicePageContext = {
    id: `segunda-via.dificuldades.${context.origem ?? "inicio"}.${context.etapa ?? "geral"}`,
    description:
      "Escolha a etapa sobre encontrar o serviço ou conferir o resultado.",
    suggestions: [
      {
        id: "find",
        label: "Consultar como encontrar",
        confirmation:
          "Você quer consultar a etapa sobre como encontrar segunda via.",
        href: withContext(`${routes.etapas}/encontrar`, {
          ...context,
          etapa: "encontrar",
        }),
      },
      {
        id: "check",
        label: "Consultar como conferir",
        confirmation:
          "Você quer consultar a etapa sobre como conferir o resultado.",
        href: withContext(`${routes.etapas}/conferir`, {
          ...context,
          etapa: "conferir",
        }),
      },
    ],
  };
  return <VoiceHelp context={voiceContext} />;
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
