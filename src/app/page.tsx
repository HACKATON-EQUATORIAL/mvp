import type { Metadata } from "next";
import { entry } from "@/app/servicos/segunda-via/_lib/content";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyCard } from "@/components/layout/journey-card";
import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "home",
  description:
    "Posso ajudar você a começar a prática, consultar uma etapa ou resolver uma dificuldade.",
  suggestions: [
    {
      id: "learn",
      label: "Aprender e praticar",
      confirmation:
        "Você quer começar a explicação e a prática de segunda via.",
      href: routes.preparacao,
    },
    {
      id: "steps",
      label: "Consultar uma etapa",
      confirmation: "Você quer consultar uma etapa da orientação.",
      href: withContext(routes.etapas, { origem: "inicio" }),
    },
    {
      id: "difficulty",
      label: "Informar dificuldade",
      confirmation: "Você quer ver opções para resolver uma dificuldade.",
      href: withContext(routes.dificuldades, { origem: "inicio" }),
    },
  ],
};

export const metadata: Metadata = { title: entry.title };

export default function Home() {
  return (
    <JourneyPage
      eyebrow={entry.eyebrow}
      title={entry.title}
      intro={entry.intro}
      voiceContext={voiceContext}
      actions={
        <>
          <ActionLink variant="primary" href={routes.preparacao}>
            Aprender e praticar
          </ActionLink>
          <ActionLink href={withContext(routes.etapas, { origem: "inicio" })}>
            Consultar uma etapa
          </ActionLink>
          <ActionLink
            href={withContext(routes.dificuldades, { origem: "inicio" })}
          >
            Tentei e não consegui
          </ActionLink>
          <ActionLink href={withContext(routes.canal, { origem: "inicio" })}>
            Já sei: ir ao canal
          </ActionLink>
        </>
      }
    >
      <JourneyCard title={entry.cardTitle}>{entry.cardBody}</JourneyCard>
    </JourneyPage>
  );
}
