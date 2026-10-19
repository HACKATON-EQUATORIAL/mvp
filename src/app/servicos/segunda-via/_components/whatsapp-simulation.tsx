"use client";

import { Check, RotateCcw, Target, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Celebration } from "@/components/brand/celebration";
import { scrollJourneyToTop } from "@/components/layout/journey-scroll";
import { PageActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { Button } from "@/components/ui/button";
import { useGetBundle } from "@/http/track/get-bundle";
import { setMascotSpeech } from "@/lib/assistant/mascot-speech";
import { feedback as sfx } from "@/lib/feedback/sound";
import { ASSISTANT_HELP_EVENT } from "@/lib/practice/activity";
import { cn } from "@/lib/utils";
import type { TrackBundle } from "@/schemas/http/track";
import { routes } from "../_lib/navigation";
import { usePracticeRun } from "../_lib/practice-run";
import { ENERGY, updateProgress } from "../_lib/progress";
import { TRACK_ID } from "../_lib/steps";
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
  ResultCard,
  Typing,
} from "./whatsapp-chat";

const TYPING_MS = 450;

/**
 * Etapa 3: a conversa inteira com a Clara, como no WhatsApp. Sem “Continuar”,
 * contador ou dica automática; a correção é local e o envio acontece uma vez,
 * no fim. Ajuda só pelo Eletriquinho (conta como apoio).
 */
export function WhatsAppSimulation() {
  const bundle = useGetBundle(TRACK_ID);
  if (!bundle.data)
    return (
      <LoadState error={bundle.isError} onRetry={() => void bundle.refetch()} />
    );
  return <Simulation bundle={bundle.data} />;
}

function Simulation({ bundle }: { bundle: TrackBundle }) {
  const items = bundle.practice.items;
  const run = usePracticeRun({
    items,
    allItemIds: items.map((item) => item.id),
    kind: "full",
    lessons: bundle.steps,
  });
  const result = bundle.simulations
    .find((simulation) => simulation.channel === "whatsapp")
    ?.steps.find((step) => step.kind === "result");
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [typing, setTyping] = useState(true);
  const [ended, setEnded] = useState(false);
  const [round, setRound] = useState(0);
  const [burst, setBurst] = useState(0);
  const [filled, setFilled] = useState(false);
  const { item, answer, done } = run;
  const askHelp = useRef(run.askHelp);
  askHelp.current = run.askHelp;
  const next = useRef(run.next);
  next.current = run.next;

  // A Clara “digita” e manda a mensagem do item atual.
  // biome-ignore lint/correctness/useExhaustiveDependencies: nova rodada também reinicia a conversa
  useEffect(() => {
    if (!item || done) return;
    setTyping(true);
    const timer = setTimeout(() => {
      setLines((current) => [...current, { from: "bot", text: item.prompt }]);
      setTyping(false);
    }, TYPING_MS);
    return () => clearTimeout(timer);
  }, [item, done, round]);

  // Resposta: certa segue a conversa; errada, a Clara responde e repete as opções.
  useEffect(() => {
    if (!answer) return;
    setTyping(true);
    const timer = setTimeout(() => {
      if (answer.correct) {
        next.current();
        return;
      }
      setLines((current) => [
        ...current,
        { from: "bot", text: answer.message },
      ]);
      setTyping(false);
    }, TYPING_MS);
    return () => clearTimeout(timer);
  }, [answer]);

  // Fim: a Clara manda a fatura e só então aparece o resultado.
  // biome-ignore lint/correctness/useExhaustiveDependencies: grava uma vez ao concluir
  useEffect(() => {
    if (!done) return;
    setTyping(true);
    const timer = setTimeout(() => {
      setLines((current) => [
        ...current,
        ...(result?.bot_messages ?? []).map((text) => ({
          from: "bot" as const,
          text,
        })),
      ]);
      setTyping(false);
      setEnded(true);
      setBurst((value) => value + 1);
      sfx.complete();
      updateProgress({
        fullDone: true,
        perfect: run.mistakes === 0,
        unassisted: !run.assisted,
      });
      setMascotSpeech({
        text: "Você conseguiu! Agora é só fazer no WhatsApp de verdade.",
        mood: "cheer",
      });
    }, TYPING_MS);
    return () => clearTimeout(timer);
  }, [done]);

  // Ajuda dada pelo Eletriquinho conta como apoio (mesma regra do backend).
  useEffect(() => {
    const onHelp = () => askHelp.current("hint");
    window.addEventListener(ASSISTANT_HELP_EVENT, onHelp);
    return () => window.removeEventListener(ASSISTANT_HELP_EVENT, onHelp);
  }, []);

  useEffect(() => () => setMascotSpeech(null), []);

  useEffect(() => {
    if (ended) scrollJourneyToTop();
  }, [ended]);

  function send(optionId: string, text: string) {
    // A resposta cita a última mensagem da Equatorial, como no WhatsApp.
    setLines((current) => [
      ...current,
      {
        from: "user",
        text,
        quote: current.findLast((line) => line.from === "bot")?.text,
      },
    ]);
    setFilled(false);
    run.choose(optionId);
  }

  function restart() {
    run.restart();
    setLines([]);
    setEnded(false);
    setFilled(false);
    setMascotSpeech(null);
    setRound((value) => value + 1);
  }

  const waiting = !typing && !!item && !done && !answer?.correct;
  const isDocument = item?.id === DOCUMENT_ITEM;
  const expected = item?.options.find((option) => option.is_expected);

  return (
    <div className={styles.practice}>
      {ended && (
        <div className={cn(styles.panel, styles.done)} role="status">
          <Celebration burst={burst} />
          <span className={styles.doneIcon} aria-hidden="true">
            <Check size={40} strokeWidth={3} />
          </span>
          <h2>
            {run.assisted ? "Concluído com ajuda" : "Você conseguiu sozinho!"}
          </h2>
          <p>
            {run.assisted
              ? "Você pediu uma ajuda no caminho, e tudo bem."
              : "Você fez a conversa inteira sem ajuda."}
          </p>
          <ul className={styles.stats} aria-label="Resumo da simulação">
            <li className={styles.stat} data-tone="energy">
              <span>Energia</span>
              <strong>
                <Zap size={18} aria-hidden="true" /> +{ENERGY.full} kWh
              </strong>
            </li>
            <li className={styles.stat} data-tone="success">
              <span>Acertos</span>
              <strong>
                <Target size={18} aria-hidden="true" />{" "}
                {Math.round((run.total / (run.total + run.mistakes)) * 100)}%
              </strong>
            </li>
          </ul>
        </div>
      )}

      <ChatFrame
        label="Conversa simulada com a Clara no WhatsApp"
        composer={
          waiting && item && isDocument ? (
            <Composer
              value={filled ? EXAMPLE_DOCUMENT : undefined}
              onFill={() => setFilled(true)}
              onSend={() => expected && send(expected.id, EXAMPLE_DOCUMENT)}
            />
          ) : (
            <Composer waiting={!ended && typing} />
          )
        }
      >
        <ChatLines lines={lines} />
        {typing && <Typing />}
        {/* Documento: só o campo de mensagem, como na demonstração (sem botões). */}
        {waiting && item && !isDocument && (
          <QuickReplies
            options={run.options.map((option) => ({
              id: option.id,
              label: option.label,
            }))}
            onChoose={(id) =>
              send(
                id,
                item.options.find((option) => option.id === id)?.label ?? id,
              )
            }
          />
        )}
        {ended && result && <ResultCard lines={result.lines} />}
      </ChatFrame>

      <PageActions>
        {ended ? (
          <>
            <ActionLink variant="primary" href={routes.concluido}>
              Concluir
            </ActionLink>
            <Button variant="secondary" onClick={restart}>
              <RotateCcw size={18} aria-hidden="true" /> Refazer a simulação
            </Button>
          </>
        ) : (
          // Durante a conversa a barra fica, como nas outras telas (voltar só no topo).
          <Button variant="secondary" onClick={restart}>
            <RotateCcw size={18} aria-hidden="true" /> Recomeçar a conversa
          </Button>
        )}
      </PageActions>
    </div>
  );
}
