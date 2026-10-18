import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StepLesson } from "@/app/servicos/segunda-via/_components/step-lesson";
import {
  readContext,
  routes,
  stepParamsSchema,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import { VoiceHelp } from "@/components/voice/voice-help";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const stepTitles = {
  encontrar: "Encontrar o serviço",
  conferir: "Conferir o resultado",
} as const;

export async function generateMetadata({
  params,
}: PageProps<"/servicos/segunda-via/etapas/[etapa]">): Promise<Metadata> {
  const result = stepParamsSchema.safeParse(await params);
  return {
    title: result.success
      ? stepTitles[result.data.etapa]
      : "Etapa não encontrada",
  };
}

export default function Page({
  params,
  searchParams,
}: PageProps<"/servicos/segunda-via/etapas/[etapa]">) {
  return (
    <JourneyPage
      eyebrow="LIÇÃO DA TRILHA"
      title="Aprenda esta etapa"
      intro="Leia com calma, veja o exemplo e siga para o próximo passo."
      voiceSlot={
        <Suspense fallback={null}>
          <PageVoice params={params} searchParams={searchParams} />
        </Suspense>
      }
      actions={null}
    >
      <Suspense fallback={<p role="status">Preparando a explicação…</p>}>
        <PageContent params={params} searchParams={searchParams} />
      </Suspense>
    </JourneyPage>
  );
}

async function PageContent({
  params,
  searchParams,
}: PageProps<"/servicos/segunda-via/etapas/[etapa]">) {
  const result = stepParamsSchema.safeParse(await params);
  if (!result.success) notFound();
  const etapa = result.data.etapa;
  return (
    <StepLesson
      etapa={etapa}
      context={{ ...readContext(await searchParams), etapa }}
    />
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
    navigation: context,
    id: `segunda-via.etapa.${etapa}.${context.origem ?? "inicio"}`,
    description:
      "Posso iniciar a prática desta etapa ou ajudar você a escolher outra.",
    suggestions: [
      {
        id: "practice",
        label: "Praticar esta etapa",
        confirmation: `Você quer praticar: ${stepTitles[etapa]}.`,
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
