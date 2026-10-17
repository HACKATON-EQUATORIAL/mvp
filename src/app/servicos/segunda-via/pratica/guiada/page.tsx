import type { Metadata } from "next";
import { JourneyPage } from "@/app/_components/layout/journey-page";
import { JourneyCard } from "@/app/servicos/segunda-via/_components/journey-card";
import { PracticeChoice } from "@/app/servicos/segunda-via/_components/practice-choice";

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
