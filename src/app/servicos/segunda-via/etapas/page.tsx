import type { Metadata } from "next";
import { Suspense } from "react";
import {
  readContext,
  returnTo,
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";
import { VoiceHelp } from "@/components/voice/voice-help";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

export const metadata: Metadata = { title: "Qual parte você quer consultar?" };

export default function Page({
  searchParams,
}: PageProps<"/servicos/segunda-via/etapas">) {
  return (
    <JourneyPage
      eyebrow="CONSULTA RÁPIDA"
      title="Qual parte você quer consultar?"
      intro="Escolha a etapa mais próxima da sua dúvida. Não precisa fazer toda a trilha."
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
    />
  );
}

async function PageVoice({
  searchParams,
}: Pick<PageProps<"/servicos/segunda-via/etapas">, "searchParams">) {
  const context = readContext(await searchParams);
  const voiceContext: VoicePageContext = {
    navigation: context,
    id: `segunda-via.etapas.${context.origem ?? "inicio"}.${context.etapa ?? "geral"}`,
    description: "Escolha se quer encontrar o serviço ou conferir o resultado.",
    suggestions: [
      {
        id: "find",
        label: "Encontrar segunda via",
        confirmation:
          "Você quer consultar como encontrar o serviço de segunda via.",
        href: withContext(`${routes.etapas}/encontrar`, {
          ...context,
          etapa: "encontrar",
        }),
      },
      {
        id: "check",
        label: "Conferir o resultado",
        confirmation: "Você quer consultar como conferir o resultado.",
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
}: Pick<PageProps<"/servicos/segunda-via/etapas">, "searchParams">) {
  const context = readContext(await searchParams);
  return (
    <>
      <ActionLink
        href={withContext(`${routes.etapas}/encontrar`, {
          ...context,
          etapa: "encontrar",
        })}
      >
        Como encontrar segunda via
      </ActionLink>
      <ActionLink
        href={withContext(`${routes.etapas}/conferir`, {
          ...context,
          etapa: "conferir",
        })}
      >
        Como conferir o resultado
      </ActionLink>
      <ActionLink href={withContext(routes.dificuldades, context)}>
        Não consegui acessar o canal
      </ActionLink>
      <ActionLink variant="primary" href={routes.preparacao}>
        Quero aprender desde o início
      </ActionLink>
      <ActionLink href={returnTo(context, "etapas", "/")}>Voltar</ActionLink>
      <ActionLink href={withContext(routes.canal, context)}>
        Ir ao canal oficial
      </ActionLink>
    </>
  );
}
