import type { Metadata } from "next";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyCard } from "@/components/layout/journey-card";
import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.preparacao",
  description: "Posso explicar o caminho ou ajudar você a consultar uma etapa.",
  suggestions: [
    {
      id: "explain",
      label: "Começar explicação",
      confirmation: "Você quer ler a explicação geral.",
      href: routes.explicacao,
    },
    {
      id: "steps",
      label: "Consultar uma etapa",
      confirmation: "Você quer escolher uma etapa para consultar.",
      href: withContext(routes.etapas, { origem: "preparacao" }),
    },
  ],
};

export const metadata: Metadata = {
  title: "Aprenda a obter outra via da conta",
};

export default function Page() {
  return (
    <JourneyPage
      eyebrow="ANTES DE COMEÇAR"
      title="Aprenda a obter outra via da conta"
      intro="Você vai acompanhar uma explicação, praticar e tentar com menos ajuda."
      voiceContext={voiceContext}
      actions={
        <>
          <ActionLink variant="primary" href={routes.explicacao}>
            Começar explicação
          </ActionLink>
          <ActionLink
            href={withContext(routes.etapas, { origem: "preparacao" })}
          >
            Prefiro consultar uma etapa
          </ActionLink>
          <ActionLink href="/">Voltar</ActionLink>
        </>
      }
    >
      <JourneyCard title="Treino seguro">
        A prática usa uma conta de exemplo. Você não precisa informar seus
        dados.
      </JourneyCard>
      <JourneyCard title="Você escolhe o ritmo">
        Pode pedir ajuda, consultar uma etapa ou sair quando quiser.
      </JourneyCard>
    </JourneyPage>
  );
}
