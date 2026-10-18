import type { Metadata } from "next";
import { Suspense } from "react";
import { DifficultyList } from "@/app/servicos/segunda-via/_components/difficulty-list";
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

export const metadata: Metadata = { title: "Onde você encontrou dificuldade?" };

export default function Page({
  searchParams,
}: PageProps<"/servicos/segunda-via/dificuldades">) {
  return (
    <JourneyPage
      eyebrow="AJUDA"
      title="Onde você encontrou dificuldade?"
      intro="Escolha o que aconteceu. Dúvida a gente resolve aqui; problema no canal oficial precisa da ajuda dele."
      voiceSlot={
        <Suspense fallback={null}>
          <PageVoice searchParams={searchParams} />
        </Suspense>
      }
      actions={null}
    >
      <Suspense fallback={<p role="status">Preparando a navegação…</p>}>
        <PageActions searchParams={searchParams} />
      </Suspense>
    </JourneyPage>
  );
}

async function PageVoice({
  searchParams,
}: Pick<PageProps<"/servicos/segunda-via/dificuldades">, "searchParams">) {
  const context = readContext(await searchParams);
  const voiceContext: VoicePageContext = {
    navigation: context,
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
      <DifficultyList context={context} />
      <ActionLink href={returnTo(context, "dificuldades", routes.preparacao)}>
        Voltar
      </ActionLink>
    </>
  );
}
