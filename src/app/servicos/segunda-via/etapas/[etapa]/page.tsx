import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ActionLink } from "@/app/_components/action-link";
import { JourneyPage } from "@/app/_components/layout/journey-page";
import { JourneyCard } from "@/app/servicos/segunda-via/_components/journey-card";
import { steps } from "@/app/servicos/segunda-via/_lib/content";
import type { Step } from "@/app/servicos/segunda-via/_lib/navigation";
import {
  readContext,
  returnTo,
  routes,
  stepParamsSchema,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";

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

export default async function Page({
  params,
  searchParams,
}: PageProps<"/servicos/segunda-via/etapas/[etapa]">) {
  const result = stepParamsSchema.safeParse(await params);
  if (!result.success) notFound();
  const etapa = result.data.etapa;
  const content = steps[etapa];
  return (
    <JourneyPage
      key={etapa}
      eyebrow="EXPLICAÇÃO CONTEXTUAL"
      title="Ajuda para esta etapa"
      intro={content.intro}
      actions={
        <Suspense fallback={<p role="status">Preparando a navegação…</p>}>
          <PageActions searchParams={searchParams} etapa={etapa} />
        </Suspense>
      }
    >
      <JourneyCard title="Explicação desta etapa">
        {content.explanation}
      </JourneyCard>
    </JourneyPage>
  );
}

export function generateStaticParams() {
  return [{ etapa: "encontrar" }, { etapa: "conferir" }];
}
async function PageActions({
  searchParams,
  etapa,
}: Pick<PageProps<"/servicos/segunda-via/etapas/[etapa]">, "searchParams"> & {
  etapa: Step;
}) {
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
