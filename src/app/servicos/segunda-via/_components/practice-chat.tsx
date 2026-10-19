"use client";

import { Check, Lightbulb, RotateCcw, Star, Target, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Celebration } from "@/components/brand/celebration";
import { scrollJourneyToTop } from "@/components/layout/journey-scroll";
import { PageActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { Button } from "@/components/ui/button";
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
  Composer,
  DOCUMENT_ITEM,
  EXAMPLE_DOCUMENT,
  QuickReplies,
} from "./whatsapp-chat";

/**
 * Etapa 2: uma parte da conversa, com dica e feedback por opção. Corrige na hora
 * com o pacote do serviço; com as 4 partes feitas, envia tudo uma vez.
 * (A etapa 3 é `WhatsAppSimulation`.)
 */
export function PracticeChat(props: { part: PartSlug }) {
  const bundle = useGetBundle(TRACK_ID);
  if (!bundle.data)
    return (
      <LoadState error={bundle.isError} onRetry={() => void bundle.refetch()} />
    );
  return <Practice key={props.part} bundle={bundle.data} part={props.part} />;
}

const expectedOption = (item: BundleItem) =>
  item.options.find((option) => option.is_expected);
/** O que a pessoa envia ao acertar: o documento vai digitado (exemplo). */
const sentText = (item: BundleItem) =>
  item.id === DOCUMENT_ITEM
    ? EXAMPLE_DOCUMENT
    : (expectedOption(item)?.label ?? "");
const sent = (item: BundleItem, past?: boolean): ChatLine => ({
  from: "user",
  text: sentText(item),
  quote: item.prompt,
  past,
});

function Practice({ bundle, part }: { bundle: TrackBundle; part: PartSlug }) {
  const all = bundle.practice.items;
  const partIndex = PARTS.findIndex((entry) => entry.slug === part);
  const config = PARTS[partIndex];
  const items = all.filter((item) => item.step_id === config.stepId);
  const run = usePracticeRun({
    items,
    allItemIds: all.map((item) => item.id),
    kind: "part",
    lessons: bundle.steps,
  });
  const lesson = bundle.steps.find((step) => step.id === config.stepId);
  const [burst, setBurst] = useState(0);
  const [filled, setFilled] = useState(false);
  const { item, answer, done } = run;

  // Pergunta nova: o campo de mensagem volta vazio.
  // biome-ignore lint/correctness/useExhaustiveDependencies: zera a cada pergunta
  useEffect(() => {
    setFilled(false);
  }, [item?.id]);

  useEffect(() => {
    if (answer?.correct || done) setBurst((value) => value + 1);
  }, [answer?.correct, done]);

  // Dicas e ajudas saem do balão do Eletriquinho e são lidas em voz alta
  // (áudio pré-gerado). Responder ou avançar limpa a fala e corta a voz.
  useEffect(() => {
    setMascotSpeech(
      run.help && !answer?.correct
        ? { text: run.help.content, mood: "think", speak: true }
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
      text: "Mais uma parte acesa! Bora para a próxima?",
      mood: "cheer",
    });
    updateProgress({ partsDone: [config.stepId], perfect: run.mistakes === 0 });
  }, [done]);

  if (done)
    return (
      <PartDone
        burst={burst}
        partIndex={partIndex}
        perfect={run.mistakes === 0}
        onRestart={run.restart}
      />
    );
  if (!item) return null;

  // Contexto: na etapa 2, o que já aconteceu antes desta parte (respostas certas).
  const before = all.slice(0, all.indexOf(items[0]));
  const history: ChatLine[] = [
    ...before.flatMap((entry) => [
      { from: "bot" as const, text: entry.prompt, past: true },
      sent(entry, true),
    ]),
    ...items
      .slice(0, run.index)
      .flatMap((entry) => [
        { from: "bot" as const, text: entry.prompt },
        sent(entry),
      ]),
    { from: "bot" as const, text: item.prompt },
    ...(answer?.correct ? [sent(item)] : []),
  ];
  const typed = item.id === DOCUMENT_ITEM;
  const expected = expectedOption(item);
  const answering = !answer?.correct;

  return (
    <div className={styles.practice}>
      {lesson && (
        <div className={chat.lesson}>
          <strong>Como funciona</strong>
          <p>{lesson.explanation.text}</p>
        </div>
      )}
      <ChatFrame
        label="Conversa simulada com a Clara"
        composer={
          answering && typed ? (
            <Composer
              value={filled ? EXAMPLE_DOCUMENT : undefined}
              onFill={() => setFilled(true)}
              onSend={() => expected && run.choose(expected.id)}
            />
          ) : (
            <Composer />
          )
        }
      >
        <ChatLines lines={history} />
        {/* Documento: só o campo de mensagem, como na demonstração (sem botões). */}
        {answering && !typed && (
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
            <span className={styles.feedbackIcon} aria-hidden="true">
              {answer.correct ? (
                <Check size={26} strokeWidth={3} />
              ) : (
                <Lightbulb size={24} />
              )}
            </span>
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
        <span className={styles.doneIcon} aria-hidden="true">
          <Check size={40} strokeWidth={3} />
        </span>
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
