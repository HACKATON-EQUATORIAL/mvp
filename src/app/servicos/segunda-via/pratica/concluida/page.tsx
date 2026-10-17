import type { Metadata } from "next";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyCard } from "@/components/layout/journey-card";
import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";

export const metadata: Metadata = { title: "Prática concluída" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="RESULTADO DO TREINO"
      title="Prática concluída"
      intro="Este é o encerramento da prática demonstrativa de escolha de serviço. Você pode repetir ou consultar uma etapa."
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
