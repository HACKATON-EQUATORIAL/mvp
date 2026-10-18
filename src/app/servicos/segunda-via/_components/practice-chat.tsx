"use client";

import {
  ExternalLink,
  Flame,
  RotateCcw,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Celebration } from "@/components/brand/celebration";
import { Eletriquinho } from "@/components/brand/eletriquinho";
import { scrollJourneyToTop } from "@/components/layout/journey-scroll";
import { PageActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { postEvent } from "@/http/events/post-events";
import { useGetBundle } from "@/http/track/get-bundle";
import { setMascotSpeech } from "@/lib/assistant/mascot-speech";
import { feedback as sfx } from "@/lib/feedback/sound";
import { cn } from "@/lib/utils";
import type { BundleItem, TrackBundle } from "@/schemas/http/track";
import { routes } from "../_lib/navigation";
import { usePracticeRun } from "../_lib/practice-run";
import { ENERGY, updateProgress } from "../_lib/progress";
import { PARTS, type PartSlug, partHref, TRACK_ID } from "../_lib/steps";
import chat from "./chat.module.css";
import { LoadState } from "./load-state";
import styles from "./practice.module.css";
import {
  ChatFrame,
  type ChatLine,
  ChatLines,
  QuickReplies,
  revealChatEnd,
} from "./whatsapp-chat";

type Props = { part: PartSlug } | { part?: undefined };

/**
 * Etapa 2 (`part`: uma parte da conversa, com dica e feedback por opção) e
 * etapa 3 (sem `part`: a conversa inteira, ajuda só sob pedido). Corrige na hora
 * com o pacote do serviço e envia tudo uma vez no fim.
 */
export function PracticeChat(props: Props) {
  const bundle = useGetBundle(TRACK_ID);
  if (!bundle.data)
    return (
      <LoadState error={bundle.isError} onRetry={() => void bundle.refetch()} />
    );
  return (
    <Practice
      key={props.part ?? "full"}
      bundle={bundle.data}
      part={props.part}
    />
  );
}

const expectedLabel = (item: BundleItem) =>
  item.options.find((option) => option.is_expected)?.label ?? "";

function Practice({ bundle, part }: { bundle: TrackBundle; part?: PartSlug }) {
  const all = bundle.practice.items;
  const partIndex = PARTS.findIndex((entry) => entry.slug === part);
  const config = part ? PARTS[partIndex] : null;
  const items = config
    ? all.filter((item) => item.step_id === config.stepId)
    : all;
  const run = usePracticeRun({
    items,
    allItemIds: all.map((item) => item.id),
    kind: part ? "part" : "full",
  });
  const lesson =
    config && bundle.steps.find((step) => step.id === config.stepId);
  const [burst, setBurst] = useState(0);
  const { item, answer, done } = run;

  useEffect(() => {
    if (answer?.correct || done) setBurst((value) => value + 1);
  }, [answer?.correct, done]);

  useEffect(() => {
    // Ao abrir, a explicação da parte fica visível.
    if (!answer && run.index === 0) return;
    revealChatEnd();
  }, [answer, run.index]);

  // Dicas e ajudas saem do balão do Eletriquinho.
  useEffect(() => {
    setMascotSpeech(
      run.help && !answer?.correct
        ? { text: run.help.content, mood: "think" }
        : null,
    );
  }, [run.help, answer?.correct]);
  useEffect(() => () => setMascotSpeech(null), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: grava uma vez ao concluir
  useEffect(() => {
    if (!done) return;
    scrollJourneyToTop();
    sfx.complete();
    setMascotSpeech({
      text: config
        ? "Mais uma parte acesa! Bora para a próxima?"
        : "Você está pronto! Agora é só fazer no WhatsApp de verdade.",
      mood: "cheer",
    });
    const perfect = run.mistakes === 0;
    updateProgress(
      config
        ? { partsDone: [config.stepId], perfect }
        : { fullDone: true, perfect, unassisted: !run.assisted },
    );
  }, [done]);

  if (done)
    return part ? (
      <PartDone
        burst={burst}
        partIndex={partIndex}
        perfect={run.mistakes === 0}
        onRestart={run.restart}
      />
    ) : (
      <Conclusion bundle={bundle} burst={burst} run={run} />
    );
  if (!item) return null;

  // Contexto: na etapa 2, o que já aconteceu antes desta parte (respostas certas).
  const before = config ? all.slice(0, all.indexOf(items[0])) : [];
  const history: ChatLine[] = [
    ...before.flatMap((entry) => [
      { from: "bot" as const, text: entry.prompt, past: true },
      { from: "user" as const, text: expectedLabel(entry), past: true },
    ]),
    ...items.slice(0, run.index).flatMap((entry) => [
      { from: "bot" as const, text: entry.prompt },
      { from: "user" as const, text: expectedLabel(entry) },
    ]),
    { from: "bot" as const, text: item.prompt },
    ...(answer?.correct
      ? [{ from: "user" as const, text: expectedLabel(item) }]
      : []),
  ];

  return (
    <div className={styles.practice}>
      {lesson && (
        <div className={chat.lesson}>
          <strong>Como funciona</strong>
          <p>{lesson.explanation.text}</p>
        </div>
      )}
      {!part && (
        <div className={styles.stepRow}>
          <p className={styles.step}>
            Mensagem {run.index + 1} de {run.total}
          </p>
          <AnimatePresence>
            {run.combo >= 2 && (
              <motion.span
                key={run.combo}
                className={styles.combo}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [1.3, 1], opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Flame size={16} aria-hidden="true" /> {run.combo} seguidas!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )}

      <ChatFrame label="Conversa simulada com a Clara">
        <ChatLines lines={history} />
        {!answer?.correct && (
          <QuickReplies
            options={run.options.map((option) => ({
              id: option.id,
              label: option.label,
              state: run.wrongIds.includes(option.id) ? "wrong" : undefined,
            }))}
            onChoose={run.choose}
          />
        )}
      </ChatFrame>

      {!part && !answer?.correct && (
        <p className={styles.note}>
          Pedir ajuda não é penalidade: o resultado só mostra se houve apoio.
        </p>
      )}

      <PageActions>
        {answer && (
          <motion.div
            key={`${answer.itemId}-${answer.optionId}`}
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
          <Button onClick={run.next}>Continuar</Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() =>
              run.askHelp(run.help?.kind === "hint" ? "explanation" : "hint")
            }
          >
            {part
              ? run.help?.kind === "hint"
                ? "Explicar melhor"
                : "Ver uma dica"
              : "Pedir ajuda"}
          </Button>
        )}
      </PageActions>
    </div>
  );
}

function PartDone({
  burst,
  partIndex,
  perfect,
  onRestart,
}: {
  burst: number;
  partIndex: number;
  perfect: boolean;
  onRestart: () => void;
}) {
  const next = PARTS[partIndex + 1];
  return (
    <div className={styles.practice}>
      <div className={cn(styles.panel, styles.done)} role="status">
        <Celebration burst={burst} />
        <Eletriquinho mood="cheer" size={88} />
        {perfect && <PerfectTag />}
        <h2>Parte {partIndex + 1} concluída!</h2>
        <p>
          {next
            ? `Próxima parte: ${next.label.toLocaleLowerCase("pt-BR")}.`
            : "Você praticou todas as partes. Agora faça a conversa inteira sozinho."}
        </p>
      </div>
      <ul className={styles.stats} aria-label="Resumo da parte">
        <Stat
          icon={Zap}
          tone="energy"
          label="Energia"
          value={`+${ENERGY.part} kWh`}
          delay={0.1}
        />
        <Stat
          icon={Target}
          tone="success"
          label="Parte"
          value={`${partIndex + 1} de ${PARTS.length}`}
          delay={0.2}
        />
      </ul>
      <PageActions>
        <ActionLink
          variant="primary"
          href={next ? partHref(next.slug) : routes.simulacao}
        >
          {next ? "Próxima parte" : "Fazer tudo sozinho"}
        </ActionLink>
        <Button variant="secondary" onClick={onRestart}>
          <RotateCcw size={18} aria-hidden="true" /> Refazer esta parte
        </Button>
      </PageActions>
    </div>
  );
}

/** Conclusão da etapa 3: saída direta para o WhatsApp oficial, com a mensagem pronta. */
function Conclusion({
  bundle,
  burst,
  run,
}: {
  bundle: TrackBundle;
  burst: number;
  run: ReturnType<typeof usePracticeRun>;
}) {
  const destination =
    bundle.channel_exit.destinations.find((item) => item.kind === "whatsapp") ??
    bundle.channel_exit.destinations[0];
  const perfect = run.mistakes === 0;
  return (
    <div className={styles.practice}>
      <div className={cn(styles.panel, styles.done)} role="status">
        <Celebration burst={burst} />
        <Eletriquinho mood="cheer" size={88} />
        {perfect && <PerfectTag />}
        <h2>
          {run.assisted ? "Conversa concluída!" : "Você conseguiu sozinho!"}
        </h2>
        <p>
          {run.assisted
            ? "Você terminou com um pouco de ajuda, e tudo bem. Agora é só repetir no WhatsApp de verdade."
            : "Você fez a conversa inteira sem ajuda. Agora é só repetir no WhatsApp de verdade."}
        </p>
      </div>
      <ul className={styles.stats} aria-label="Resumo da simulação">
        <Stat
          icon={Zap}
          tone="energy"
          label="Energia"
          value={`+${ENERGY.full} kWh`}
          delay={0.1}
        />
        <Stat
          icon={Target}
          tone="success"
          label="Acertos"
          value={`${Math.round((run.total / (run.total + run.mistakes)) * 100)}%`}
          delay={0.2}
        />
      </ul>
      <p className={styles.note}>{bundle.channel_exit.requirements_notice}</p>
      <PageActions>
        {destination ? (
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
            Abrir o WhatsApp oficial{" "}
            <ExternalLink size={18} aria-hidden="true" />
          </a>
        ) : null}
        <Button variant="secondary" onClick={run.restart}>
          <RotateCcw size={18} aria-hidden="true" /> Refazer a simulação
        </Button>
      </PageActions>
    </div>
  );
}

function PerfectTag() {
  return (
    <motion.span
      className={styles.perfect}
      initial={{ scale: 0, rotate: -12 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.3 }}
    >
      <Star size={16} fill="currentColor" aria-hidden="true" /> Lição perfeita
    </motion.span>
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
