import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

export function ServicePage({
  title,
  voiceContext,
}: {
  title: string;
  voiceContext: VoicePageContext;
}) {
  return (
    <JourneyPage
      eyebrow="SERVIÇO"
      title={title}
      intro="Este serviço ainda não está disponível nesta demonstração."
      voiceContext={voiceContext}
      actions={
        <ActionLink variant="primary" href="/">
          Voltar ao início
        </ActionLink>
      }
    />
  );
}
