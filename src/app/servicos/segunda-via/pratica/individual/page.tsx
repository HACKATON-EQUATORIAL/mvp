import type { Metadata } from "next";
import { PracticeChoice } from "@/app/servicos/segunda-via/_components/practice-choice";
import { JourneyCard } from "@/components/layout/journey-card";
import { JourneyPage } from "@/components/layout/journey-page";

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
