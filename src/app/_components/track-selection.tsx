"use client";

import {
  FileText,
  HeartHandshake,
  type LucideIcon,
  Search,
  ZapOff,
} from "lucide-react";
import {
  ENERGY_MAX,
  energyOf,
  useJourneyProgress,
} from "@/app/servicos/segunda-via/_lib/progress";
import { ChoiceCard, choiceCardStyles } from "@/components/layout/choice-card";
import { JourneyPage } from "@/components/layout/journey-page";
import { Button } from "@/components/ui/button";
import type { VoicePageContext } from "@/components/voice/voice-page-context";
import { useGetTracks } from "@/http/track/get-tracks";
import type { TrackSummary } from "@/schemas/http/track";
import styles from "./track-selection.module.css";
import { TrackSelectionSkeleton } from "./track-selection-skeleton";

// Only implemented journeys can be opened, even if the backend grows its catalog.
const destinations: Record<string, string | undefined> = {
  "segunda-via": "/servicos/segunda-via",
};

const icons: Record<string, LucideIcon> = {
  "segunda-via": FileText,
  "consultar-debitos": Search,
  "falta-de-energia": ZapOff,
  "tarifa-social": HeartHandshake,
};

export function TrackSelection() {
  const query = useGetTracks();
  const tracks = query.data ?? [];
  const voiceContext: VoicePageContext = {
    id: "home-tracks",
    description: query.data
      ? "Escolha um serviço para começar a aprender. Posso ajudar você a encontrar uma opção disponível."
      : "Os serviços estão sendo consultados. Você pode tentar novamente se eles não carregarem.",
    tip: "Oi! Eu sou o Eletriquinho. Escolha um serviço e vamos juntos, no seu ritmo.",
    screen: {
      stage: "servicos",
      teaches:
        "Lista de serviços para aprender. Só Segunda via está disponível; os demais estão em breve.",
    },
    suggestions: tracks
      .filter((track) => track.status === "available" && destinations[track.id])
      .slice(0, 3)
      .map((track) => ({
        id: track.id,
        label: track.title,
        confirmation: `Você quer começar: ${track.title}?`,
        href: destinations[track.id] ?? "/",
      })),
  };

  return (
    <JourneyPage
      eyebrow="SERVIÇOS"
      title="Aprenda a usar o atendimento digital da Equatorial"
      intro="Escolha um serviço. Você aprende com uma conta de exemplo e, no fim, faz o pedido real sozinho."
      actions={null}
      voiceContext={voiceContext}
    >
      <section
        className={styles.catalog}
        aria-label="Serviços disponíveis"
        aria-busy={query.isFetching}
      >
        {query.isPending && (
          <TrackSelectionSkeleton paused={query.fetchStatus === "paused"} />
        )}
        {query.isError && (
          <div className={styles.feedback} role="alert">
            <p>
              Não foi possível {query.data ? "atualizar" : "carregar"} as
              serviços. Confira sua conexão e tente novamente.
            </p>
            <Button
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
            >
              Tentar novamente
            </Button>
          </div>
        )}
        {query.isSuccess && tracks.length === 0 && (
          <p role="status">Nenhum serviço disponível no momento.</p>
        )}
        {tracks.length > 0 && (
          <ul className={choiceCardStyles.list}>
            {tracks.map((track) => (
              <TrackItem key={track.id} track={track} />
            ))}
          </ul>
        )}
      </section>
    </JourneyPage>
  );
}

const descriptions: Record<string, string> = {
  "segunda-via": "Peça a outra via da sua conta de luz.",
  "consultar-debitos": "Veja se há contas em aberto.",
  "falta-de-energia": "Avise quando a luz cair.",
  "tarifa-social": "Desconto na conta para quem tem direito.",
};

function TrackItem({ track }: { track: TrackSummary }) {
  const href = destinations[track.id];
  const available = track.status === "available" && !!href;
  const energy = energyOf(useJourneyProgress());
  const started = track.id === "segunda-via" && energy > 0;
  return (
    <li>
      <ChoiceCard
        // Quem já começou volta direto ao mapa do WhatsApp (único canal disponível).
        href={available ? (started ? `${href}/whatsapp` : href) : undefined}
        icon={icons[track.id] ?? FileText}
        title={track.title}
        description={descriptions[track.id] ?? "Aprenda no seu ritmo."}
        meta={
          available
            ? started
              ? `Continuar · ${energy} de ${ENERGY_MAX} kWh`
              : "Comece em 2 minutos"
            : undefined
        }
        progress={available && started ? energy / ENERGY_MAX : undefined}
      />
    </li>
  );
}
