import type { Metadata } from "next";
import { Suspense } from "react";
import { ChannelExit } from "@/app/servicos/segunda-via/_components/channel-exit";
import {
  readContext,
  returnTo,
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import { PageActions as BottomActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { VoiceHelp } from "@/components/voice/voice-help";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

export const metadata: Metadata = { title: "Continuar no canal oficial" };

export default function Page({
  searchParams,
}: PageProps<"/servicos/segunda-via/canal">) {
  return (
    <JourneyPage
      eyebrow="META DA TRILHA"
      title="Continuar no canal oficial"
      intro="Você treinou com uma conta de exemplo. Agora é a vez de fazer o pedido real no canal oficial da Equatorial."
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
      <ChannelExit context={context} />
      <BottomActions>
        <ActionLink href={returnTo(context, "canal", routes.preparacao)}>
          Voltar
        </ActionLink>
      </BottomActions>
    </>
  );
}
