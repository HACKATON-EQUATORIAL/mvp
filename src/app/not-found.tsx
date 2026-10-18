import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "not-found",
  description: "Posso levar você de volta aos serviços ou à segunda via.",
  suggestions: [
    {
      id: "second-copy",
      label: "Segunda via pelo WhatsApp",
      confirmation: "Você quer abrir a segunda via pelo WhatsApp?",
      href: "/servicos/segunda-via/whatsapp",
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
      title="Esta tela não está disponível"
      intro="Volte à escolha de serviços para continuar."
      voiceContext={voiceContext}
      actions={
        <ActionLink variant="primary" href="/">
          Ver os serviços
        </ActionLink>
      }
    />
  );
}
