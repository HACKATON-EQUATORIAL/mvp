"use client";

import { CheckCircle2, Lightbulb, RotateCcw, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { PracticeMode } from "@/schemas/http/practice";
import { routes } from "../_lib/navigation";
import { updateProgress } from "../_lib/progress";
import { localStep } from "../_lib/steps";
import { usePracticeSession } from "../_lib/use-practice-session";
import styles from "./practice.module.css";

const stepLabel = {
  encontrar: "Encontrar o serviço",
  conferir: "Conferir o resultado",
} as const;

export function PracticeSession({ mode }: { mode: PracticeMode }) {
  const router = useRouter();
  const session = usePracticeSession(mode);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const guided = mode === "guided";
  const { state, item, answer } = session;
  const completed = state?.status === "completed" && !answer?.correct;

  useEffect(() => {
    if (answer) feedbackRef.current?.focus();
  }, [answer]);

  useEffect(() => {
    if (state?.status !== "completed") return;
    updateProgress(guided ? { guidedDone: true } : { independentDone: true });
  }, [state?.status, guided]);

  async function leave() {
    await session.leave();
    router.push(routes.preparacao);
  }

  if (session.error)
    return (
      <div className={styles.panel} role="alert">
        <p>
          Não foi possível iniciar a prática agora. Confira sua conexão e tente
          novamente.
        </p>
        <Button onClick={session.retry}>Tentar novamente</Button>
      </div>
    );

  if (session.loading || !state)
    return (
      <div role="status" aria-label="Preparando a prática">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-6 h-7 w-4/5" />
        <Skeleton className="mt-4 h-14 w-full" />
        <Skeleton className="mt-3 h-14 w-full" />
        <Skeleton className="mt-3 h-14 w-full" />
      </div>
    );

  if (completed)
    return (
      <div className={styles.practice}>
        <ProgressBar
          current={state.progress.total}
          total={state.progress.total}
        />
        <div className={cn(styles.panel, styles.done)} role="status">
          <CheckCircle2 size={36} aria-hidden="true" />
          <h2>
            {guided
              ? "Prática com apoio concluída!"
              : state.assisted
                ? "Prática concluída!"
                : "Você conseguiu sozinho!"}
          </h2>
          <p>
            {guided
              ? "Você passou pelas duas etapas com ajuda. Agora tente sem dicas automáticas."
              : state.assisted
                ? "Você concluiu usando ajuda, e tudo bem. Repita sem ajuda quando quiser."
                : "Você concluiu sem pedir ajuda."}
          </p>
        </div>
        <Button
          onClick={() =>
            router.push(
              guided
                ? routes["pratica-individual"]
                : routes["pratica-concluida"],
            )
          }
        >
          {guided ? "Agora tente sozinho" : "Ver meu resultado"}
        </Button>
        <Button variant="secondary" onClick={session.restart}>
          <RotateCcw size={18} aria-hidden="true" /> Praticar de novo
        </Button>
      </div>
    );

  if (!item) return null;
  const step = localStep(item.step_id);
  const { total } = state.progress;
  // Após um acerto a API já avançou; o número exibido segue o item respondido.
  const number = answer?.correct
    ? state.status === "completed"
      ? total
      : state.progress.current - 1
    : state.progress.current;

  return (
    <div className={styles.practice}>
      <ProgressBar
        current={answer?.correct ? number : number - 1}
        total={total}
      />
      <p className={styles.step}>
        Pergunta {number} de {total}
        {step ? ` · ${stepLabel[step]}` : ""}
      </p>
      <h2 className={styles.prompt}>{item.prompt}</h2>

      <fieldset className={styles.options} disabled={session.pending}>
        <legend className="sr-only">Escolha uma opção</legend>
        {item.options.map((option) => {
          const chosenRight = answer?.correct && answer.optionId === option.id;
          const wrong = session.wrongIds.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              className={styles.option}
              data-state={chosenRight ? "correct" : wrong ? "wrong" : undefined}
              disabled={answer?.correct || wrong}
              aria-pressed={chosenRight || wrong}
              onClick={() => session.choose(option.id)}
            >
              {chosenRight ? (
                <CheckCircle2 size={22} aria-hidden="true" />
              ) : wrong ? (
                <XCircle size={22} aria-hidden="true" />
              ) : null}
              <span>{option.label}</span>
            </button>
          );
        })}
      </fieldset>

      {answer && (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          role="status"
          className={cn(
            styles.panel,
            answer.correct ? styles.correct : styles.wrong,
          )}
        >
          <strong>{answer.correct ? "Isso mesmo!" : "Ainda não."}</strong>
          <p>{answer.message}</p>
        </div>
      )}

      {session.help && !answer?.correct && (
        <div className={cn(styles.panel, styles.help)} role="status">
          <Lightbulb size={20} aria-hidden="true" />
          <p>{session.help.content}</p>
        </div>
      )}

      {session.actionError && (
        <p role="alert" className={styles.error}>
          Não consegui registrar agora. Tente de novo.
        </p>
      )}

      <div className={styles.actions}>
        {answer?.correct ? (
          <Button onClick={session.next}>Continuar</Button>
        ) : (
          <>
            {guided && item.hint_available && (
              <Button
                variant="secondary"
                loading={session.helpPending}
                onClick={() => session.askHelp("hint")}
              >
                Ver uma dica
              </Button>
            )}
            {!guided && (
              <Button
                variant="secondary"
                loading={session.helpPending}
                onClick={() => session.askHelp("hint")}
              >
                Pedir ajuda
              </Button>
            )}
            <Button
              variant="ghost"
              loading={session.helpPending}
              onClick={() => session.askHelp("accessibility")}
            >
              Descrever as opções
            </Button>
          </>
        )}
        <Button variant="ghost" onClick={() => void leave()}>
          Sair da prática
        </Button>
      </div>
      {!guided && !answer?.correct && (
        <p className={styles.note}>
          Pedir ajuda não é penalidade: o resultado só mostra se houve apoio.
        </p>
      )}
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div
      className={styles.progress}
      role="progressbar"
      aria-label="Progresso da prática"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
    >
      <span style={{ width: `${(current / total) * 100}%` }} />
    </div>
  );
}
