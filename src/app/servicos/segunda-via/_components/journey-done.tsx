"use client";

import { Check, Circle, ExternalLink, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Celebration } from "@/components/brand/celebration";
import { PageActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { buttonVariants } from "@/components/ui/button";
import { postEvent } from "@/http/events/post-events";
import { useGetBundle } from "@/http/track/get-bundle";
import { setMascotSpeech } from "@/lib/assistant/mascot-speech";
import { feedback as sfx } from "@/lib/feedback/sound";
import { routes } from "../_lib/navigation";
import {
  badgesOf,
  ENERGY_MAX,
  energyOf,
  useJourneyProgress,
} from "../_lib/progress";
import { PARTS, partHref, TRACK_ID } from "../_lib/steps";
import styles from "./done.module.css";
import { LoadState } from "./load-state";

/**
 * Meta da jornada: com as 3 etapas feitas, explica que a pessoa já pode usar o
 * atendimento digital e abre o WhatsApp oficial da Clara com a mensagem pronta.
 */
export function JourneyDone() {
  const bundle = useGetBundle(TRACK_ID);
  const progress = useJourneyProgress();
  const [burst, setBurst] = useState(0);
  const parts = PARTS.filter((part) =>
    progress.partsDone.includes(part.stepId),
  ).length;
  const stages = [
    {
      label: "Etapa 1 · Ver como funciona",
      done: progress.demoDone,
      href: routes.demonstracao,
    },
    {
      label: `Etapa 2 · Praticar por partes (${parts} de ${PARTS.length})`,
      done: parts === PARTS.length,
      href: partHref(
        (
          PARTS.find((part) => !progress.partsDone.includes(part.stepId)) ??
          PARTS[0]
        ).slug,
      ),
    },
    {
      label: "Etapa 3 · Fazer tudo sozinho",
      done: progress.fullDone,
      href: routes.simulacao,
    },
  ];
  const complete = stages.every((stage) => stage.done);
  const next = stages.find((stage) => !stage.done);

  useEffect(() => {
    if (!complete) {
      setMascotSpeech({
        text: "Falta pouco! Termine as etapas e eu te levo à Clara.",
        mood: "happy",
      });
      return;
    }
    setBurst((value) => value + 1);
    sfx.complete();
    setMascotSpeech({
      text: "Você está pronto! Toque no botão e peça sua segunda via à Clara.",
      mood: "cheer",
    });
  }, [complete]);
  useEffect(() => () => setMascotSpeech(null), []);

  if (!bundle.data)
    return (
      <LoadState error={bundle.isError} onRetry={() => void bundle.refetch()} />
    );
  const destination =
    bundle.data.channel_exit.destinations.find(
      (item) => item.kind === "whatsapp",
    ) ?? bundle.data.channel_exit.destinations[0];
  const earned = badgesOf(progress).filter((badge) => badge.earned).length;

  return (
    <div className={styles.done}>
      <div className={styles.hero} role="status">
        <Celebration burst={burst} />
        <span
          className={styles.icon}
          data-complete={complete || undefined}
          aria-hidden="true"
        >
          {complete ? (
            <Check size={44} strokeWidth={3} />
          ) : (
            <Circle size={40} />
          )}
        </span>
        <h2>{complete ? "Você concluiu tudo!" : "Quase lá!"}</h2>
        <p>
          {complete
            ? "Agora você já sabe pedir a segunda via no atendimento digital. É só abrir o WhatsApp da Clara: a mensagem já vai escrita."
            : "Termine as etapas que faltam para liberar o WhatsApp oficial."}
        </p>
      </div>

      <ul className={styles.stages} aria-label="Suas etapas">
        {stages.map((stage) => (
          <li key={stage.label} data-done={stage.done || undefined}>
            {stage.done ? (
              <Check size={20} strokeWidth={3} aria-hidden="true" />
            ) : (
              <Circle size={20} aria-hidden="true" />
            )}
            <span>{stage.label}</span>
            <span className="sr-only">
              {stage.done ? "(concluída)" : "(falta)"}
            </span>
          </li>
        ))}
      </ul>

      <p className={styles.summary}>
        <Zap size={18} aria-hidden="true" />
        <strong>
          {energyOf(progress)} / {ENERGY_MAX} kWh
        </strong>
        <span>
          · {earned} {earned === 1 ? "selo" : "selos"}
        </span>
      </p>

      {complete && (
        <p className={styles.notice}>
          {bundle.data.channel_exit.requirements_notice}
        </p>
      )}

      <PageActions>
        {complete && destination ? (
          <a
            href={destination.url}
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
            Abrir o WhatsApp da Clara{" "}
            <ExternalLink size={18} aria-hidden="true" />
          </a>
        ) : (
          <ActionLink variant="primary" href={next?.href ?? routes.whatsapp}>
            Continuar de onde parei
          </ActionLink>
        )}
        <ActionLink variant="secondary" href={routes.whatsapp}>
          Ver as etapas
        </ActionLink>
      </PageActions>
    </div>
  );
}
