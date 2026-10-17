import { JourneyPage } from "@/app/_components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";

export function ServicePage({ title }: { title: string }) {
  return (
    <JourneyPage
      eyebrow="SERVIÇO"
      title={title}
      intro="Este serviço ainda não está disponível nesta demonstração."
      actions={
        <ActionLink variant="primary" href="/">
          Voltar ao início
        </ActionLink>
      }
    />
  );
}
