import { JourneyPage } from "@/app/_components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";

export default function NotFound() {
  return (
    <JourneyPage
      eyebrow="PÁGINA NÃO ENCONTRADA"
      title="Esta etapa não está disponível"
      intro="Escolha uma etapa da orientação para continuar."
      actions={
        <ActionLink variant="primary" href="/servicos/segunda-via/etapas">
          Consultar uma etapa
        </ActionLink>
      }
    />
  );
}
