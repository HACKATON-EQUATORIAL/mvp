import type { Metadata } from "next";
import { LessonIllustration } from "@/app/servicos/segunda-via/_components/lesson-illustration";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.pratica-conferencia",
  description:
    "Mostra a conta de exemplo usada na prática. Posso abrir a lição de conferir ou iniciar a prática.",
  suggestions: [
    {
      id: "explain",
      label: "Explicação de conferência",
      confirmation: "Você quer consultar como conferir o resultado.",
      href: withContext(`${routes.etapas}/conferir`, {
        origem: "pratica-conferencia",
        etapa: "conferir",
      }),
    },
    {
      id: "practice",
      label: "Praticar agora",
      confirmation: "Você quer iniciar a prática guiada.",
      href: routes["pratica-guiada"],
    },
  ],
};

export const metadata: Metadata = { title: "Conheça a conta de exemplo" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="MATERIAL DE APOIO"
      title="Conheça a conta de exemplo"
      intro="É esta conta que aparece na prática. Veja onde ficam as informações que você vai conferir."
      voiceContext={voiceContext}
      actions={
        <>
          <ActionLink variant="primary" href={routes["pratica-guiada"]}>
            Praticar agora
          </ActionLink>
          <ActionLink
            href={withContext(`${routes.etapas}/conferir`, {
              origem: "pratica-conferencia",
              etapa: "conferir",
            })}
          >
            Ver a lição de conferir
          </ActionLink>
        </>
      }
    >
      <LessonIllustration step="conferir" />
    </JourneyPage>
  );
}
