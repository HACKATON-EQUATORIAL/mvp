"use client";

import { Check, ExternalLink, GraduationCap, Target } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { postEvent } from "@/http/events/post-events";
import { useGetTrack } from "@/http/track/get-track";
import { routes, withContext } from "../_lib/navigation";
import { useJourneyProgress } from "../_lib/progress";
import { localStep, TRACK_ID } from "../_lib/steps";
import { LoadState } from "./load-state";
import styles from "./roadmap.module.css";

type Node = {
  id: string;
  title: string;
  detail: string;
  href: string;
  done: boolean;
};

/** Mapa da trilha: onde estou, o que falta e o que já aprendi. */
export function TrackRoadmap() {
  const track = useGetTrack(TRACK_ID);
  const progress = useJourneyProgress();

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
          },
        ]
      : [];
  });
  const nodes: Node[] = [
    ...lessons,
    {
      id: "guided",
      title: "Praticar com apoio",
      detail: "3 perguntas com dicas e explicação a cada resposta.",
      href: routes["pratica-guiada"],
      done: progress.guidedDone,
    },
    {
      id: "independent",
      title: "Tentar sozinho",
      detail: "As mesmas perguntas, sem dica automática.",
      href: routes["pratica-individual"],
      done: progress.independentDone,
    },
    {
      id: "simulator",
      title: "Treinar no canal (simulado)",
      detail:
        "O caminho da Agência Virtual ou do WhatsApp da Clara, com dados de exemplo.",
      href: routes.simulador,
      done: progress.simulated.length > 0,
    },
  ];
  const next = nodes.find((node) => !node.done);
  const doneCount = nodes.filter((node) => node.done).length;

  return (
    <div className={styles.roadmap}>
      {track.data.objective && (
        <p className={styles.objective}>
          <Target size={20} aria-hidden="true" />
          <span>
            <strong>Objetivo:</strong> {track.data.objective}
          </span>
        </p>
      )}
      <p className={styles.count} aria-live="polite">
        {doneCount} de {nodes.length} passos concluídos
      </p>
      <ol className={styles.path}>
        {nodes.map((node, index) => {
          const state = node.done
            ? "done"
            : node === next
              ? "current"
              : "upcoming";
          return (
            <li key={node.id} data-state={state}>
              <Link href={node.href} className={styles.node}>
                <span className={styles.badge} aria-hidden="true">
                  {node.done ? <Check size={20} strokeWidth={3} /> : index + 1}
                </span>
                <span className={styles.label}>
                  <strong>{node.title}</strong>
                  <span>{node.detail}</span>
                  <span className="sr-only">
                    {node.done
                      ? "(concluído)"
                      : node === next
                        ? "(próximo passo)"
                        : ""}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        <li data-state={next ? "goal" : "current"}>
          <Link
            href={withContext(routes.canal, { origem: "preparacao" })}
            className={styles.node}
          >
            <span className={styles.badge} aria-hidden="true">
              <GraduationCap size={20} />
            </span>
            <span className={styles.label}>
              <strong>Meta: usar o canal oficial</strong>
              <span>Depois do treino, faça o pedido real com segurança.</span>
            </span>
            <ExternalLink
              size={16}
              aria-hidden="true"
              className={styles.goalIcon}
            />
          </Link>
        </li>
      </ol>
      {track.data.simulated_notice && (
        <p className={styles.notice}>{track.data.simulated_notice}</p>
      )}
      <div className={styles.actions}>
        <ActionLink
          variant="primary"
          href={
            next?.href ?? withContext(routes.canal, { origem: "preparacao" })
          }
        >
          {doneCount === 0
            ? "Começar a trilha"
            : next
              ? `Continuar: ${next.title.replace(/^Lição \d+: /, "")}`
              : "Ir para o canal oficial"}
        </ActionLink>
        <ActionLink href={withContext(routes.etapas, { origem: "preparacao" })}>
          Só quero tirar uma dúvida
        </ActionLink>
      </div>
    </div>
  );
}
