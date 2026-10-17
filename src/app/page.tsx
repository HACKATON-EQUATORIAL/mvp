import type { Metadata } from "next";
import { entry } from "@/app/servicos/segunda-via/_lib/content";
import {
  routes,
  withContext,
} from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyCard } from "@/components/layout/journey-card";
import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";

export const metadata: Metadata = { title: entry.title };

export default function Home() {
  return (
    <JourneyPage
      eyebrow={entry.eyebrow}
      title={entry.title}
      intro={entry.intro}
      actions={
        <>
          <ActionLink variant="primary" href={routes.preparacao}>
            Aprender e praticar
          </ActionLink>
          <ActionLink href={withContext(routes.etapas, { origem: "inicio" })}>
            Consultar uma etapa
          </ActionLink>
          <ActionLink
            href={withContext(routes.dificuldades, { origem: "inicio" })}
          >
            Tentei e não consegui
          </ActionLink>
          <ActionLink href={withContext(routes.canal, { origem: "inicio" })}>
            Já sei: ir ao canal
          </ActionLink>
        </>
      }
    >
      <JourneyCard title={entry.cardTitle}>{entry.cardBody}</JourneyCard>
    </JourneyPage>
  );
}
