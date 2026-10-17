import type { Metadata } from "next";
import { JourneyPage } from "@/app/_components/layout/journey-page";
import { JourneyCard } from "@/app/servicos/segunda-via/_components/journey-card";
import { PracticeChoice } from "@/app/servicos/segunda-via/_components/practice-choice";

export const metadata: Metadata = { title: "Agora, tente você" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="PRÁTICA INDIVIDUAL"
      title="Agora, tente você"
      intro="Sua tarefa é encontrar a opção de segunda via neste exemplo. Escolha um serviço."
      actions={<PracticeChoice guided={false} />}
    >
      <JourneyCard title="Sem dica automática">
        Se precisar, você pode pedir ajuda. Isso não é uma penalidade.
      </JourneyCard>
    </JourneyPage>
  );
}
