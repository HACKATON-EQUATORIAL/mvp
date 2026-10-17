import type { Metadata } from "next";
import { Suspense } from "react";
import { JourneyPage } from "@/app/_components/layout/journey-page";
import {
  readContext,
  returnTo,
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { ActionLink } from "@/components/ui/action-link";

export const metadata: Metadata = { title: "Qual parte você quer consultar?" };

export default function Page({
  searchParams,
}: PageProps<"/servicos/segunda-via/etapas">) {
  return (
    <JourneyPage
      eyebrow="CONSULTA RÁPIDA"
      title="Qual parte você quer consultar?"
      intro="Escolha a etapa mais próxima da sua dúvida. Não precisa fazer toda a trilha."
      actions={
        <Suspense fallback={<p role="status">Preparando a navegação…</p>}>
          <PageActions searchParams={searchParams} />
        </Suspense>
      }
    />
  );
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
