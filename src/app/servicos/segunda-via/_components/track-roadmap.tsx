"use client";

import {
  BookOpen,
  Check,
  Hand,
  type LucideIcon,
  ShieldCheck,
  Smartphone,
  Target,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { FaiscaTip } from "@/components/brand/faisca";
import { PageActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { postEvent } from "@/http/events/post-events";
import { useGetTrack } from "@/http/track/get-track";
import { routes, withContext } from "../_lib/navigation";
import { useJourneyProgress } from "../_lib/progress";
import { localStep, TRACK_ID } from "../_lib/steps";
import { EnergyMeter } from "./energy-meter";
import { LoadState } from "./load-state";
import styles from "./roadmap.module.css";

type Node = {
  id: string;
  title: string;
  detail: string;
  href: string;
  done: boolean;
  icon: LucideIcon;
};

// Zigue-zague da trilha, como um caminho de lições.
const offsets = [0, 48, 0, -48];

/** Trilha de energia: cada passo concluído “acende”; a meta é o canal oficial. */
export function TrackRoadmap() {
  const track = useGetTrack(TRACK_ID);
  const progress = useJourneyProgress();
  const reduced = useReducedMotion();

  useEffect(() => {
    postEvent({ type: "journey_entered", payload: { intent: "learn" } });
  }, []);

  if (!track.data)
    return (
      <LoadState error={track.isError} onRetry={() => void track.refetch()} />
    );

  const lessons: Node[] = track.data.steps.flatMap((step) => {
    const local = localStep(step.id);
    return local
      ? [
          {
            id: step.id,
            title: `Lição ${step.order}: ${step.title}`,
            detail: step.consult_title,
            href: `${routes.etapas}/${local}`,
            done: progress.learned.includes(local),
            icon: BookOpen,
          },
        ]
      : [];
  });
  const nodes: Node[] = [
    ...lessons,
    {
      id: "guided",
      title: "Praticar com apoio",
      detail: "3 perguntas com dica e explicação.",
      href: routes["pratica-guiada"],
      done: progress.guidedDone,
      icon: Hand,
    },
    {
      id: "independent",
      title: "Tentar sozinho",
      detail: "As mesmas perguntas, sem dica automática.",
      href: routes["pratica-individual"],
      done: progress.independentDone,
      icon: Target,
    },
    {
      id: "simulator",
      title: "Treinar no canal",
      detail: "Agência Virtual ou WhatsApp da Clara, simulados.",
      href: routes.simulador,
      done: progress.simulated.length > 0,
      icon: Smartphone,
    },
  ];
  const next = nodes.find((node) => !node.done);
  const doneCount = nodes.filter((node) => node.done).length;
  const channel = withContext(routes.canal, { origem: "preparacao" });
  const short = (title: string) => title.replace(/^Lição \d+: /, "");

  return (
    <div className={styles.roadmap}>
      <EnergyMeter />
      <FaiscaTip mood={next ? "happy" : "cheer"}>
        {doneCount === 0
          ? "Oi! Eu sou a Faísca. Vamos acender a sua primeira lição?"
          : next
            ? `${nodes.length - doneCount === 1 ? "Falta 1 passo" : `Faltam ${nodes.length - doneCount} passos`}. Próximo: ${short(next.title)}.`
            : "Trilha completa! Agora é hora de usar o canal oficial."}
      </FaiscaTip>

      <ol className={styles.path} aria-label="Passos da trilha">
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
                      {doneCount === 0 ? "Começar" : "Próximo"}
                    </span>
                  )}
                  <strong>{node.title}</strong>
                  <span>{node.detail}</span>
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
          <Link href={channel} className={`${styles.node} ${styles.goal}`}>
            <span className={styles.badge} aria-hidden="true">
              <ShieldCheck size={28} />
            </span>
            <span className={styles.label}>
              <strong>Meta: usar o canal oficial</strong>
              <span>Faça o pedido real com segurança.</span>
            </span>
          </Link>
        </li>
      </ol>

      {track.data.simulated_notice && (
        <p className={styles.notice}>{track.data.simulated_notice}</p>
      )}
      <PageActions>
        <ActionLink variant="primary" href={next?.href ?? channel}>
          {doneCount === 0
            ? "Começar a trilha"
            : next
              ? `Continuar: ${short(next.title)}`
              : "Ir para o canal oficial"}
        </ActionLink>
        <ActionLink href={withContext(routes.etapas, { origem: "preparacao" })}>
          Só quero tirar uma dúvida
        </ActionLink>
      </PageActions>
    </div>
  );
}
