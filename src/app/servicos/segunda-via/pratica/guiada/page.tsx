import type { Metadata } from "next";
import { PracticeChoice } from "@/app/servicos/segunda-via/_components/practice-choice";
import { JourneyCard } from "@/components/layout/journey-card";
import { JourneyPage } from "@/components/layout/journey-page";

export const metadata: Metadata = { title: "Vamos praticar" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="PRÁTICA GUIADA"
      title="Vamos praticar"
      intro="Você precisa de outra via da conta. Qual serviço escolheria?"
      actions={<PracticeChoice guided />}
    >
      <JourneyCard title="Dica disponível">
        Procure o nome do serviço que corresponde à tarefa. Este é um exemplo de
        prática, sem dados reais.
      </JourneyCard>
    </JourneyPage>
  );
}
