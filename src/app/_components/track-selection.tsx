"use client";

import { JourneyPage } from "@/components/layout/journey-page";
import { ActionLink } from "@/components/ui/action-link";
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

export function TrackSelection() {
  const query = useGetTracks();
  const tracks = query.data ?? [];
  const voiceContext: VoicePageContext = {
    id: "home-tracks",
    description: query.data
      ? "Escolha uma trilha para começar a aprender. Posso ajudar você a encontrar uma opção disponível."
      : "As trilhas estão sendo consultadas. Você pode tentar novamente se elas não carregarem.",
    suggestions: tracks
      .filter((track) => track.status === "available" && destinations[track.id])
      .slice(0, 3)
      .map((track) => ({
        id: track.id,
        label: track.title,
        confirmation: `Você quer começar a trilha: ${track.title}.`,
        href: destinations[track.id] ?? "/",
      })),
  };

  return (
    <JourneyPage
      eyebrow="TRILHAS DE APRENDIZAGEM"
      title="O que você quer aprender?"
      intro="Escolha uma trilha e aprenda no seu ritmo."
      actions={null}
      voiceContext={voiceContext}
    >
      <section
        className={styles.catalog}
        aria-label="Trilhas disponíveis"
        aria-busy={query.isFetching}
      >
        {query.isPending && (
          <TrackSelectionSkeleton paused={query.fetchStatus === "paused"} />
        )}
        {query.isError && (
          <div className={styles.feedback} role="alert">
            <p>
              Não foi possível {query.data ? "atualizar" : "carregar"} as
              trilhas. Confira sua conexão e tente novamente.
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
          <p role="status">Nenhuma trilha disponível no momento.</p>
        )}
        {tracks.length > 0 && (
          <ul className={styles.list}>
            {tracks.map((track) => (
              <TrackItem key={track.id} track={track} />
            ))}
          </ul>
        )}
      </section>
    </JourneyPage>
  );
}

function TrackItem({ track }: { track: TrackSummary }) {
  const href = destinations[track.id];
  const available = track.status === "available" && !!href;
  return (
    <li className={styles.item}>
      {available ? (
        <ActionLink href={href}>{track.title}</ActionLink>
      ) : (
        <Button disabled>
          {track.title}
          <span className={styles.status}>Em breve</span>
        </Button>
      )}
    </li>
  );
}
