import type { Metadata } from "next";
import { ActionLink } from "@/app/_components/action-link";
import styles from "@/app/_components/layout/journey.module.css";
import { JourneyPage } from "@/app/_components/layout/journey-page";
import { JourneyCard } from "@/app/servicos/segunda-via/_components/journey-card";
import { routes } from "@/app/servicos/segunda-via/_lib/navigation";

export const metadata: Metadata = { title: "Entenda o caminho" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="EXPLICAÇÃO / VISÃO GERAL"
      title="Entenda o caminho"
      intro="Na prática, você vai reconhecer a opção de segunda via e conferir o resultado."
      actions={
        <>
          <ActionLink href="#explicacao">Ler explicação</ActionLink>
          <ActionLink variant="primary" href={routes["pratica-guiada"]}>
            Praticar agora
          </ActionLink>
          <ActionLink href={routes.preparacao}>Voltar</ActionLink>
        </>
      }
    >
      <div id="explicacao" tabIndex={-1} className={styles.content}>
        <JourneyCard title="1. Encontrar o serviço">
          Localize a opção correspondente à sua necessidade.
        </JourneyCard>
        <JourneyCard title="2. Conferir o resultado">
          Verifique se chegou à conta que pretendia obter.
        </JourneyCard>
        <p>
          Este caminho é ilustrativo. As opções e os passos reais dependem do
          canal oficial, ainda a confirmar.
        </p>
      </div>
    </JourneyPage>
  );
}
