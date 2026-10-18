"use client";

import { ActionLink } from "@/components/ui/action-link";
import { useGetTrack } from "@/http/track/get-track";
import {
  type NavigationContext,
  routes,
  withContext,
} from "../_lib/navigation";
import { localStep, TRACK_ID } from "../_lib/steps";
import styles from "./lesson.module.css";
import { LoadState } from "./load-state";

/**
 * Lista as etapas da trilha (API). `mode="learn"` apresenta o caminho completo;
 * `mode="consult"` serve à consulta rápida de uma etapa.
 */
export function TrackOverview({
  mode,
  context = {},
}: {
  mode: "learn" | "consult";
  context?: NavigationContext;
}) {
  const track = useGetTrack(TRACK_ID);
  if (!track.data)
    return (
      <LoadState error={track.isError} onRetry={() => void track.refetch()} />
    );

  const steps = track.data.steps.flatMap((step) => {
    const local = localStep(step.id);
    return local ? [{ ...step, local }] : [];
  });

  return (
    <div className={styles.lesson}>
      {mode === "learn" && track.data.objective && (
        <p className={styles.text}>{track.data.objective}</p>
      )}
      <ol className="grid gap-2 p-0" style={{ listStyle: "none" }}>
        {steps.map((step) => (
          <li key={step.id}>
            <ActionLink
              variant={
                mode === "learn" && step.order === 1 ? "primary" : "secondary"
              }
              href={withContext(`${routes.etapas}/${step.local}`, {
                ...context,
                etapa: step.local,
              })}
            >
              {step.order}. {mode === "learn" ? step.title : step.consult_title}
            </ActionLink>
          </li>
        ))}
      </ol>
    </div>
  );
}
