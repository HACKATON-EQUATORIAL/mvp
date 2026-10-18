import type { Metadata } from "next";
import { PracticeResult } from "@/app/servicos/segunda-via/_components/practice-result";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
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

export const metadata: Metadata = { title: "Seu resultado" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="RESULTADO DO TREINO"
      title="Seu resultado"
      intro="Veja como foi sua prática e qual é o próximo passo."
      voiceContext={voiceContext}
      actions={null}
    >
      <PracticeResult />
    </JourneyPage>
  );
}
