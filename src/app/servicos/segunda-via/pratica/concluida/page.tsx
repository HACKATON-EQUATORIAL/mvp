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
  id: "segunda-via.pratica-concluida",
  description:
    "Você pode consultar uma etapa, repetir a prática ou ver o próximo passo interno.",
  suggestions: [
    {
      id: "steps",
      label: "Consultar uma etapa",
      confirmation: "Você quer escolher uma etapa da orientação.",
      href: withContext(routes.etapas, { origem: "pratica-concluida" }),
    },
    {
      id: "repeat",
      label: "Praticar novamente",
      confirmation: "Você quer repetir a prática guiada.",
      href: routes["pratica-guiada"],
    },
    {
      id: "channel",
      label: "Conhecer o próximo passo",
      confirmation:
        "Você quer abrir a página interna sobre o canal, cujo destino oficial ainda não foi confirmado.",
      href: withContext(routes.canal, { origem: "pratica-concluida" }),
    },
  ],
};

export const metadata: Metadata = { title: "Prática concluída" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="RESULTADO DO TREINO"
      title="Prática concluída"
      intro="Este é o encerramento da prática demonstrativa de escolha de serviço. Você pode repetir ou consultar uma etapa."
      voiceContext={voiceContext}
      actions={
        <>
          <ActionLink
            variant="primary"
            href={withContext(routes.canal, { origem: "pratica-concluida" })}
          >
            Conhecer o próximo passo
          </ActionLink>
          <ActionLink href={routes["pratica-guiada"]}>
            Praticar novamente
          </ActionLink>
          <ActionLink
            href={withContext(routes.etapas, { origem: "pratica-concluida" })}
          >
            Consultar uma etapa
          </ActionLink>
        </>
      }
    >
      <JourneyCard title="Seu próximo passo">
        Conheça os limites desta demonstração e as informações sobre o canal
        oficial. O destino ainda precisa ser confirmado.
      </JourneyCard>
      <JourneyCard title="Antes de continuar">
        A simulação não emite uma conta nem confirma domínio do procedimento. No
        canal real, confira sempre se a conta corresponde à sua necessidade.
      </JourneyCard>
    </JourneyPage>
  );
}
