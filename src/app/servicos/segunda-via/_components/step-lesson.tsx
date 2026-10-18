"use client";

import { useEffect } from "react";
import { EletriquinhoTip } from "@/components/brand/eletriquinho";
import { PageActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { postEvent } from "@/http/events/post-events";
import { useGetStep } from "@/http/track/get-step";
import { useGetTrack } from "@/http/track/get-track";
import type { StepDetail } from "@/schemas/http/track";
import {
  type NavigationContext,
  returnTo,
  routes,
  type Step,
  withContext,
} from "../_lib/navigation";
import { ENERGY, updateProgress } from "../_lib/progress";
import { apiStepIds, localStep, TRACK_ID } from "../_lib/steps";
import styles from "./lesson.module.css";
import { LessonIllustration } from "./lesson-illustration";
import { LoadState } from "./load-state";

// O “guarde isto” de cada lição: a ideia que a prática vai cobrar.
const takeaways = {
  encontrar:
    "Guarde: a conta fica em “Segunda via”. “Consultar débitos” mostra o que está em aberto, mas não entrega a conta.",
  conferir:
    "Guarde: setembro é o mês 09. Antes de pagar, confira o mês de referência e a identificação.",
} as const;

const practiceOrigins = new Set([
  "pratica-guiada",
  "pratica-individual",
  "pratica-conferencia",
]);

/** Lição de uma etapa com o conteúdo versionado da API. */
export function StepLesson({
  etapa,
  context,
}: {
  etapa: Step;
  context: NavigationContext;
}) {
  const step = useGetStep(TRACK_ID, apiStepIds[etapa]);
  const track = useGetTrack(TRACK_ID);
  const fromPractice = !!context.origem && practiceOrigins.has(context.origem);

  useEffect(() => {
    if (!step.data) return;
    updateProgress({ learned: [etapa] });
    postEvent({
      type: "explanation_viewed",
      payload: {
        step_id: step.data.id,
        source: fromPractice ? "help" : context.origem ? "consult" : "learn",
      },
    });
  }, [step.data, etapa, fromPractice, context.origem]);

  if (!step.data)
    return (
      <LoadState error={step.isError} onRetry={() => void step.refetch()} />
    );

  const total = track.data?.steps.length;
  const links = nextLinks(step.data, context);
  const primary = fromPractice
    ? null
    : (links.find((l) => l.kind === "next_step") ??
      links.find((l) => l.kind === "practice"));

  return (
    <article className={styles.lesson}>
      <p className={styles.kicker}>
        Etapa {step.data.order}
        {total ? ` de ${total}` : ""} · {step.data.title}
      </p>
      <h2 className={styles.question}>{step.data.consult_title}</h2>
      <p className={styles.text}>{step.data.explanation.text}</p>
      <LessonIllustration step={etapa} />
      <EletriquinhoTip mood="think">{takeaways[etapa]}</EletriquinhoTip>
      <p className={styles.gain}>+{ENERGY.lesson} kWh de conhecimento</p>
      <PageActions>
        {fromPractice ? (
          <ActionLink
            variant="primary"
            href={returnTo(context, "ajuda", routes["pratica-guiada"])}
          >
            Voltar à prática
          </ActionLink>
        ) : (
          primary && (
            <ActionLink variant="primary" href={primary.href}>
              Próxima etapa
            </ActionLink>
          )
        )}
        <ActionLink
          variant="ghost"
          size="sm"
          href={withContext(routes.etapas, context)}
        >
          Consultar uma dúvida
        </ActionLink>
      </PageActions>
      <nav aria-label="Outros caminhos" className="grid gap-2 pt-2">
        {links
          .filter((link) => link !== primary && link.kind !== "consult")
          .map((link) => (
            <ActionLink key={link.kind + link.href} href={link.href}>
              {link.label}
            </ActionLink>
          ))}
      </nav>
    </article>
  );
}

function nextLinks(step: StepDetail, context: NavigationContext) {
  return step.next_actions.flatMap((action) => {
    const target = localStep(action.step_id);
    const href =
      (action.kind === "next_step" || action.kind === "previous_step") && target
        ? withContext(`${routes.etapas}/${target}`, {
            ...context,
            etapa: target,
          })
        : action.kind === "practice"
          ? routes["pratica-guiada"]
          : action.kind === "consult"
            ? withContext(routes.etapas, context)
            : action.kind === "channel_exit"
              ? withContext(routes.canal, context)
              : null;
    return href ? [{ kind: action.kind, label: action.label, href }] : [];
  });
}
