import type { Metadata } from "next";
import { JourneyPage } from "@/app/_components/layout/journey-page";
import { JourneyCard } from "@/app/servicos/segunda-via/_components/journey-card";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { ActionLink } from "@/components/ui/action-link";

export const metadata: Metadata = {
  title: "Aprenda a obter outra via da conta",
};

export default function Page() {
  return (
    <JourneyPage
      eyebrow="ANTES DE COMEÇAR"
      title="Aprenda a obter outra via da conta"
      intro="Você vai acompanhar uma explicação, praticar e tentar com menos ajuda."
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
