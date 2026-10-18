"use client";

import {
  Check,
  Eye,
  type LucideIcon,
  MessageCircle,
  MessageSquareText,
  Target,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { postEvent } from "@/http/events/post-events";
import { useGetBundle } from "@/http/track/get-bundle";
import { routes } from "../_lib/navigation";
import { useJourneyProgress } from "../_lib/progress";
import { PARTS, partHref, TRACK_ID } from "../_lib/steps";
import { BadgeShelf } from "./badge-shelf";
import { EnergyMeter } from "./energy-meter";
import { HelpSheet } from "./help-sheet";
import { LoadState } from "./load-state";
import styles from "./roadmap.module.css";

type Node = {
  id: string;
  stage: string;
  title: string;
  href: string;
  done: boolean;
  icon: LucideIcon;
};

// Zigue-zague do caminho, como uma sequência de lições.
const offsets = [0, 48, 0, -48];

/** Mapa das 3 etapas no WhatsApp: ver, praticar por partes e fazer sozinho. */
export function TrackRoadmap() {
  const bundle = useGetBundle(TRACK_ID);
  const progress = useJourneyProgress();
  const reduced = useReducedMotion();
  const [help, setHelp] = useState(false);

  useEffect(() => {
    postEvent({ type: "journey_entered", payload: { intent: "learn" } });
  }, []);

  if (!bundle.data)
    return (
      <LoadState error={bundle.isError} onRetry={() => void bundle.refetch()} />
    );

  const nodes: Node[] = [
    {
      id: "demo",
      stage: "Etapa 1",
      title: "Ver como funciona",
      href: routes.demonstracao,
      done: progress.demoDone,
      icon: Eye,
    },
    ...PARTS.map((part, index) => ({
      id: part.slug,
      stage: `Etapa 2 · parte ${index + 1}`,
      title: part.label,
      href: partHref(part.slug),
      done: progress.partsDone.includes(part.stepId),
      icon: MessageSquareText,
    })),
    {
      id: "full",
      stage: "Etapa 3",
      title: "Fazer tudo sozinho",
      href: routes.simulacao,
      done: progress.fullDone,
      icon: Target,
    },
  ];
  const next = nodes.find((node) => !node.done);
  const started = nodes.some((node) => node.done);
  const official = bundle.data.channel_exit.destinations[0];

  return (
    <div className={styles.roadmap}>
      <EnergyMeter completed={!next} />
      <ol className={styles.path} aria-label="Etapas do aprendizado">
        {nodes.map((node, index) => {
          const state = node.done
            ? "done"
            : node === next
              ? "current"
              : "upcoming";
          const Icon = node.icon;
          return (
            <li
              key={node.id}
              data-state={state}
              style={
                {
                  "--offset": `${offsets[index % offsets.length]}px`,
                } as React.CSSProperties
              }
            >
              <Link href={node.href} className={styles.node}>
                <motion.span
                  className={styles.badge}
                  aria-hidden="true"
                  animate={
                    state === "current" && !reduced
                      ? { scale: [1, 1.06, 1] }
                      : undefined
                  }
                  transition={{
                    duration: 1.8,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  {node.done ? (
                    <Check size={30} strokeWidth={3} />
                  ) : (
                    <Icon size={28} />
                  )}
                </motion.span>
                <span className={styles.label}>
                  {state === "current" && (
                    <span className={styles.start}>
                      {started ? "Próximo" : "Começar"}
                    </span>
                  )}
                  <span>{node.stage}</span>
                  <strong>{node.title}</strong>
                  <span className="sr-only">
                    {node.done ? "(concluído)" : ""}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        <li
          data-state="goal"
          style={{ "--offset": "0px" } as React.CSSProperties}
        >
          <Link
            href={routes.simulacao}
            className={`${styles.node} ${styles.goal}`}
          >
            <span className={styles.badge} aria-hidden="true">
              <MessageCircle size={28} />
            </span>
            <span className={styles.label}>
              <strong>Meta: WhatsApp oficial</strong>
              <span>Tirar a segunda via de verdade.</span>
            </span>
          </Link>
        </li>
      </ol>

      <BadgeShelf />
      <p className={styles.notice}>{bundle.data.simulated_notice}</p>
      <HelpSheet open={help} onOpenChange={setHelp} />
      <PageActions>
        {next || !official ? (
          <ActionLink variant="primary" href={next?.href ?? routes.simulacao}>
            {!started
              ? "Começar"
              : next
                ? `Continuar: ${next.title.toLocaleLowerCase("pt-BR")}`
                : "Refazer a simulação"}
          </ActionLink>
        ) : (
          <a
            href={official.url}
            target="_blank"
            rel="noopener noreferrer"
            data-slot="button"
            className={buttonVariants({ variant: "primary" })}
            onClick={() =>
              postEvent({
                type: "channel_exit_clicked",
                payload: { origin: "practice_completed" },
              })
            }
          >
            Abrir o WhatsApp oficial
          </a>
        )}
        <Button variant="secondary" onClick={() => setHelp(true)}>
          Ajuda
        </Button>
      </PageActions>
    </div>
  );
}
