import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { steps } from "@/app/servicos/segunda-via/_lib/content";
import {
  readContext,
  returnTo,
  routes,
  stepParamsSchema,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyCard } from "@/components/layout/journey-card";
import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";
import { VoiceHelp } from "@/components/voice/voice-help";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

export async function generateMetadata({
  params,
}: PageProps<"/servicos/segunda-via/etapas/[etapa]">): Promise<Metadata> {
  const result = stepParamsSchema.safeParse(await params);
  return {
    title: result.success
      ? steps[result.data.etapa].title
      : "Etapa não encontrada",
  };
}

export default function Page({
  params,
  searchParams,
}: PageProps<"/servicos/segunda-via/etapas/[etapa]">) {
  return (
    <JourneyPage
      eyebrow="EXPLICAÇÃO CONTEXTUAL"
      title="Ajuda para esta etapa"
      intro="Confira a orientação para a etapa que você selecionou."
      voiceSlot={
        <Suspense fallback={null}>
          <PageVoice params={params} searchParams={searchParams} />
        </Suspense>
      }
      actions={
        <Suspense fallback={<p role="status">Preparando a navegação…</p>}>
          <PageActions params={params} searchParams={searchParams} />
        </Suspense>
      }
    >
      <Suspense fallback={<p role="status">Preparando a explicação…</p>}>
        <PageContent params={params} />
      </Suspense>
    </JourneyPage>
  );
}

async function PageContent({
  params,
}: Pick<PageProps<"/servicos/segunda-via/etapas/[etapa]">, "params">) {
  const result = stepParamsSchema.safeParse(await params);
  if (!result.success) notFound();
  const content = steps[result.data.etapa];

  return (
    <JourneyCard title="Explicação desta etapa">
      {content.explanation}
    </JourneyCard>
  );
}

async function PageVoice({
  params,
  searchParams,
}: PageProps<"/servicos/segunda-via/etapas/[etapa]">) {
  const result = stepParamsSchema.safeParse(await params);
  if (!result.success) notFound();
  const etapa = result.data.etapa;
  const context = { ...readContext(await searchParams), etapa };
  const href =
    etapa === "encontrar"
      ? routes["pratica-guiada"]
      : routes["pratica-conferencia"];
  const voiceContext: VoicePageContext = {
    id: `segunda-via.etapa.${etapa}.${context.origem ?? "inicio"}`,
    description:
      "Posso iniciar a prática desta etapa ou ajudar você a escolher outra.",
    suggestions: [
      {
        id: "practice",
        label: "Praticar esta etapa",
        confirmation: `Você quer praticar: ${steps[etapa].title}.`,
        href,
      },
      {
        id: "other-step",
        label: "Escolher outra etapa",
        confirmation: "Você quer escolher qual etapa consultar.",
        href: withContext(routes.etapas, context),
      },
    ],
  };
  return <VoiceHelp context={voiceContext} />;
}

export function generateStaticParams() {
  return [{ etapa: "encontrar" }, { etapa: "conferir" }];
}
async function PageActions({
  params,
  searchParams,
}: PageProps<"/servicos/segunda-via/etapas/[etapa]">) {
  const result = stepParamsSchema.safeParse(await params);
  if (!result.success) notFound();
  const etapa = result.data.etapa;
  const context = { ...readContext(await searchParams), etapa };
  return (
    <>
      <ActionLink
        variant="primary"
        href={returnTo(context, "ajuda", routes.etapas)}
      >
        Voltar à etapa
      </ActionLink>
      <ActionLink href={withContext(routes.etapas, context)}>
        Escolher outra etapa
      </ActionLink>
      <ActionLink
        href={
          etapa === "encontrar"
            ? routes["pratica-guiada"]
            : routes["pratica-conferencia"]
        }
      >
        Praticar esta etapa
      </ActionLink>
      <ActionLink href={withContext(routes.canal, context)}>
        Ir ao canal oficial
      </ActionLink>
    </>
  );
}
