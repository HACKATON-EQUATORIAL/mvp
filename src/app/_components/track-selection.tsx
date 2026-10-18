"use client";

import {
  ChevronRight,
  FileText,
  HeartHandshake,
  Lock,
  type LucideIcon,
  Search,
  ZapOff,
} from "lucide-react";
import Link from "next/link";
import {
  ENERGY_MAX,
  energyOf,
  useJourneyProgress,
} from "@/app/servicos/segunda-via/_lib/progress";
import { EletriquinhoTip } from "@/components/brand/eletriquinho";
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
      title="Aprenda a usar o atendimento digital da Equatorial"
      intro="Trilhas curtas, com prática segura e uma conta de exemplo. No fim, você faz o pedido real sozinho."
      actions={null}
      voiceContext={voiceContext}
    >
      <EletriquinhoTip mood="wave">
        Oi! Eu sou o Eletriquinho. Escolha uma trilha e vamos juntos, no seu
        ritmo.
      </EletriquinhoTip>
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
  const Icon = icons[track.id] ?? FileText;
  const energy = energyOf(useJourneyProgress());
  const started = track.id === "segunda-via" && energy > 0;
  // Comece já: quem ainda não começou vai direto para a primeira lição.
  const target =
    available && !started && track.id === "segunda-via"
      ? "/servicos/segunda-via/etapas/encontrar"
      : href;
  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {available ? <Icon size={26} /> : <Lock size={22} />}
      </span>
      <span className={styles.body}>
        <strong>{track.title}</strong>
        {available ? (
          <span>
            {started
              ? `Continuar · ${energy} de ${ENERGY_MAX} kWh`
              : "Comece em 2 minutos"}
          </span>
        ) : (
          <span className={styles.status}>Em breve</span>
        )}
        {available && started && (
          <span className={styles.bar} aria-hidden="true">
            <span
              className={styles.fill}
              style={{ width: `${(energy / ENERGY_MAX) * 100}%` }}
            />
          </span>
        )}
      </span>
      {available && <ChevronRight size={22} aria-hidden="true" />}
    </>
  );
  return (
    <li className={styles.item} data-available={available || undefined}>
      {available ? (
        <Link href={target ?? "/"} className={styles.card}>
          {content}
        </Link>
      ) : (
        <div className={styles.card} aria-disabled="true">
          {content}
        </div>
      )}
    </li>
  );
}
