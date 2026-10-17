import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "not-found",
  description: "Posso levar você de volta ao início ou à lista de etapas.",
  suggestions: [
    {
      id: "steps",
      label: "Consultar etapas",
      confirmation: "Você quer ver as etapas disponíveis.",
      href: "/servicos/segunda-via/etapas",
    },
    {
      id: "home",
      label: "Voltar ao início",
      confirmation: "Você quer voltar à tela inicial.",
      href: "/",
    },
  ],
};

export default function NotFound() {
  return (
    <JourneyPage
      eyebrow="PÁGINA NÃO ENCONTRADA"
      title="Esta etapa não está disponível"
      intro="Escolha uma etapa da orientação para continuar."
      voiceContext={voiceContext}
      actions={
        <ActionLink variant="primary" href="/servicos/segunda-via/etapas">
          Consultar uma etapa
        </ActionLink>
      }
    />
  );
}
