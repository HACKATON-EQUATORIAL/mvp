"use client";

import {
  CheckCircle2,
  Flame,
  Lightbulb,
  RotateCcw,
  Star,
  Target,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Celebration } from "@/components/brand/celebration";
import { Eletriquinho, EletriquinhoTip } from "@/components/brand/eletriquinho";
import { scrollJourneyToTop } from "@/components/layout/journey-scroll";
import { PageActions } from "@/components/layout/page-actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { feedback as sfx } from "@/lib/feedback/sound";
import { cn } from "@/lib/utils";
import type { PracticeMode } from "@/schemas/http/practice";
import { routes } from "../_lib/navigation";
import { ENERGY, updateProgress } from "../_lib/progress";
import { readMissed } from "../_lib/review";
import { localStep } from "../_lib/steps";
import { usePracticeSession } from "../_lib/use-practice-session";
import styles from "./practice.module.css";

const stepLabel = {
  encontrar: "Encontrar o serviço",
  conferir: "Conferir o resultado",
} as const;

export function PracticeSession({
  mode,
  review = false,
}: {
  mode: PracticeMode;
  /** Revisão: só as perguntas erradas antes (IDs guardados no navegador). */
  review?: boolean;
}) {
  const router = useRouter();
  // A lista é fixada ao abrir (já no cliente); acertos durante a revisão não
  // mudam a tentativa em andamento.
  const [reviewItems, setReviewItems] = useState<string[] | null | undefined>(
    review ? null : undefined,
  );
  useEffect(() => {
    if (review) setReviewItems(readMissed());
  }, [review]);
  const session = usePracticeSession(mode, reviewItems);
  const guided = mode === "guided";
  const { state, item, answer } = session;
  const completed = state?.status === "completed" && !answer?.correct;
  const [burst, setBurst] = useState(0);

  // Só ao concluir: subir a tela e tocar o som (uma vez).
  useEffect(() => {
    if (!completed) return;
    scrollJourneyToTop();
    sfx.complete();
  }, [completed]);

  // Cada acerto e a conclusão disparam uma pequena celebração.
  useEffect(() => {
    if (answer?.correct || completed) setBurst((value) => value + 1);
  }, [answer?.correct, completed]);

  useEffect(() => {
    if (state?.status !== "completed") return;
    const perfect = session.mistakes === 0;
    if (review) {
      if (perfect) updateProgress({ perfect: true });
      return;
    }
    updateProgress(
      guided
        ? { guidedDone: true, perfect }
        : { independentDone: true, perfect, unassisted: !state.assisted },
    );
  }, [state?.status, state?.assisted, session.mistakes, guided, review]);

  async function leave() {
    await session.leave();
    router.push(routes.preparacao);
  }

  if (review && reviewItems?.length === 0)
    return (
      <div className={styles.practice}>
        <EletriquinhoTip mood="cheer">
          Nada para revisar: você acertou tudo de primeira. Que tal praticar de
          novo ou seguir a trilha?
        </EletriquinhoTip>
        <PageActions>
          <Button onClick={() => router.push(routes.preparacao)}>
            Ver a trilha
          </Button>
        </PageActions>
      </div>
    );

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
          <Celebration burst={burst} />
          <Eletriquinho mood="cheer" size={88} />
          {session.mistakes === 0 && (
            <motion.span
              className={styles.perfect}
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 12,
                delay: 0.3,
              }}
            >
              <Star size={16} fill="currentColor" aria-hidden="true" /> Lição
              perfeita
            </motion.span>
          )}
          <h2>
            {review
              ? "Revisão concluída!"
              : guided
                ? "Prática com apoio concluída!"
                : state.assisted
                  ? "Prática concluída!"
                  : "Você conseguiu sozinho!"}
          </h2>
          <p>
            {review
              ? "Você revisou o que tinha errado. Agora é seguir a trilha."
              : guided
                ? "Você passou pelas duas etapas com ajuda. Agora tente sem dicas automáticas."
                : state.assisted
                  ? "Você concluiu usando ajuda, e tudo bem. Repita sem ajuda quando quiser."
                  : "Você concluiu sem pedir ajuda."}
          </p>
        </div>
        <ul className={styles.stats} aria-label="Resumo da prática">
          <Stat
            icon={review ? RotateCcw : Zap}
            tone="energy"
            label={review ? "Revisão" : "Energia"}
            value={
              review
                ? `${state.progress.total} ${state.progress.total === 1 ? "revisada" : "revisadas"}`
                : `+${guided ? ENERGY.guided : ENERGY.independent} kWh`
            }
            delay={0.1}
          />
          <Stat
            icon={Target}
            tone="success"
            label="Acertos"
            value={`${Math.round((state.progress.total / (state.progress.total + session.mistakes)) * 100)}%`}
            delay={0.2}
          />
        </ul>
        <PageActions>
          <Button
            onClick={() =>
              router.push(
                review
                  ? routes.preparacao
                  : guided
                    ? routes["pratica-individual"]
                    : routes["pratica-concluida"],
              )
            }
          >
            {review
              ? "Voltar à trilha"
              : guided
                ? "Agora tente sozinho"
                : "Ver meu resultado"}
          </Button>
          <Button variant="secondary" onClick={session.restart}>
            <RotateCcw size={18} aria-hidden="true" /> Praticar de novo
          </Button>
        </PageActions>
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
      <div className={styles.stepRow}>
        <p className={styles.step}>
          Pergunta {number} de {total}
          {step ? ` · ${stepLabel[step]}` : ""}
        </p>
        <AnimatePresence>
          {session.combo >= 2 && (
            <motion.span
              key={session.combo}
              className={styles.combo}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [1.3, 1], opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Flame size={16} aria-hidden="true" /> {session.combo} seguidas!
            </motion.span>
          )}
        </AnimatePresence>
      </div>
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

      <PageActions>
        {answer && (
          <motion.div
            key={`${answer.item.id}-${answer.optionId}`}
            role="status"
            data-feedback={answer.correct ? "correct" : "wrong"}
            className={cn(
              styles.feedbackStrip,
              answer.correct ? styles.correct : styles.wrong,
            )}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          >
            {answer.correct && <Celebration burst={burst} />}
            <Eletriquinho mood={answer.correct ? "cheer" : "think"} size={52} />
            <span>
              <strong>{answer.correct ? "Mandou bem!" : "Quase lá!"}</strong>
              <p>{answer.message}</p>
            </span>
          </motion.div>
        )}
        {answer?.correct ? (
          <Button
            onClick={() => {
              session.next();
              scrollJourneyToTop();
            }}
          >
            Continuar
          </Button>
        ) : (
          <Button
            variant="secondary"
            loading={session.helpPending}
            onClick={() => session.askHelp("hint")}
          >
            {guided ? "Ver uma dica" : "Pedir ajuda"}
          </Button>
        )}
      </PageActions>
      <div className={styles.inlineActions}>
        {!answer?.correct && (
          <Button
            variant="ghost"
            loading={session.helpPending}
            onClick={() => session.askHelp("accessibility")}
          >
            Descrever as opções
          </Button>
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

function Stat({
  icon: Icon,
  tone,
  label,
  value,
  delay,
}: {
  icon: typeof Zap;
  tone: "energy" | "success";
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.li
      className={styles.stat}
      data-tone={tone}
      initial={{ y: 16, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay }}
    >
      <span>{label}</span>
      <strong>
        <Icon size={18} aria-hidden="true" /> {value}
      </strong>
    </motion.li>
  );
}
