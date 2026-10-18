"use client";

import { useState } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { Button } from "@/components/ui/button";
import { postEvent } from "@/http/events/post-events";
import { useGetDifficulties } from "@/http/track/get-difficulties";
import {
  type NavigationContext,
  routes,
  withContext,
} from "../_lib/navigation";
import { localStep, TRACK_ID } from "../_lib/steps";
import styles from "./lesson.module.css";
import { LoadState } from "./load-state";

/** Separa dúvida (dá para aprender) de bloqueio externo (canal oficial). */
export function DifficultyList({ context }: { context: NavigationContext }) {
  const query = useGetDifficulties(TRACK_ID);
  const [selected, setSelected] = useState<string | null>(null);
  if (!query.data)
    return (
      <LoadState error={query.isError} onRetry={() => void query.refetch()} />
    );

  const item = query.data.items.find((entry) => entry.id === selected);
  const destination = item?.destination;
  const step = localStep(destination?.step_id);
  const href =
    destination?.kind === "step" && step
      ? withContext(`${routes.etapas}/${step}`, { ...context, etapa: step })
      : destination?.kind === "overview"
        ? routes.explicacao
        : withContext(routes.canal, { ...context, origem: "dificuldades" });

  return (
    <div className={styles.lesson}>
      <fieldset className="m-0 grid gap-2 border-0 p-0">
        <legend className="sr-only">O que aconteceu?</legend>
        {query.data.items.map((entry) => (
          <Button
            key={entry.id}
            variant={entry.id === selected ? "primary" : "secondary"}
            aria-pressed={entry.id === selected}
            onClick={() => {
              setSelected(entry.id);
              postEvent({
                type: "difficulty_reported",
                payload: {
                  option_id: entry.id,
                  classification: entry.classification,
                },
              });
            }}
          >
            {entry.label}
          </Button>
        ))}
      </fieldset>
      {item && (
        <div role="status" className="grid gap-3 pt-2">
          <p className={styles.text}>{item.guidance}</p>
          <ActionLink variant="primary" href={href}>
            {destination?.kind === "step"
              ? "Ver a lição desta etapa"
              : destination?.kind === "overview"
                ? "Ver o caminho completo"
                : "Ver orientações do canal oficial"}
          </ActionLink>
        </div>
      )}
    </div>
  );
}
