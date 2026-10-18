"use client";

import { Pause, Play, SkipBack } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Celebration } from "@/components/brand/celebration";
import { PageActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { Button } from "@/components/ui/button";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useGetBundle } from "@/http/track/get-bundle";
import { setMascotSpeech } from "@/lib/assistant/mascot-speech";
import { useSoundEnabled } from "@/lib/feedback/preferences";
import { feedback as sfx } from "@/lib/feedback/sound";
import { setPracticeActivity } from "@/lib/practice/activity";
import type { TrackBundle } from "@/schemas/http/track";
import { updateProgress } from "../_lib/progress";
import { PARTS, partHref, TRACK_ID } from "../_lib/steps";
import styles from "./chat.module.css";
import { LoadState } from "./load-state";
import {
  ChatFrame,
  type ChatLine,
  ChatLines,
  QuickReplies,
  ResultCard,
  revealChatEnd,
  Typing,
} from "./whatsapp-chat";

type Phase = "typing" | "narrate" | "tap";
type Step = TrackBundle["simulations"][number]["steps"][number];

const TYPING_MS = 900;
const TAP_MS = 1400;
const END_SPEECH = "Viu como é simples? Agora é a sua vez de praticar.";

/** Etapa 1: a conversa com a Clara toca sozinha, narrada pelo Eletriquinho. */
export function DemoScene() {
  const bundle = useGetBundle(TRACK_ID);
  const simulation = bundle.data?.simulations.find(
    (item) => item.channel === "whatsapp",
  );
  if (!simulation)
    return (
      <LoadState
        error={bundle.isError || (!!bundle.data && !simulation)}
        onRetry={() => void bundle.refetch()}
      />
    );
  return <Scene steps={simulation.steps} />;
}

const expected = (step: Step) =>
  step.options.find((option) => option.is_expected);

function Scene({ steps }: { steps: Step[] }) {
  const reduced = useReducedMotion();
  const sound = useSoundEnabled();
  const tts = useSpeechSynthesis();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(reduced ? "narrate" : "typing");
  // Com movimento reduzido, nada avança sozinho.
  const [playing, setPlaying] = useState(!reduced);
  const [finished, setFinished] = useState(false);
  const [burst, setBurst] = useState(0);
  const step = steps[index];
  const last = index === steps.length - 1;
  const { speak, cancel } = tts;

  function goTo(next: number) {
    cancel();
    setFinished(false);
    setIndex(next);
    setPhase(reduced || !playing ? "narrate" : "typing");
  }

  function finish() {
    cancel();
    setFinished(true);
    setPlaying(false);
    setBurst((value) => value + 1);
    sfx.complete();
    updateProgress({ demoDone: true });
  }

  function advance() {
    if (phase === "typing") return setPhase("narrate");
    if (phase === "narrate" && expected(step) && !last) return setPhase("tap");
    if (last) return finish();
    goTo(index + 1);
  }

  // Narração: o balão do Eletriquinho mostra a instrução; com som, ele lê em voz alta.
  useEffect(() => {
    if (finished) {
      setMascotSpeech({ text: END_SPEECH, mood: "cheer" });
      if (sound) speak(END_SPEECH);
      return;
    }
    if (phase !== "narrate") return;
    setMascotSpeech({ text: step.instruction, mood: "talk" });
    if (sound && (playing || reduced)) speak(step.instruction);
  }, [finished, phase, step, sound, playing, reduced, speak]);

  // Linha do tempo: cada fase agenda a próxima enquanto estiver tocando.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `advance` lê o estado atual a cada fase
  useEffect(() => {
    if (!playing || finished) return;
    const reading = Math.max(2400, step.instruction.length * 55);
    const ms =
      phase === "typing"
        ? TYPING_MS
        : phase === "tap"
          ? TAP_MS
          : tts.speaking
            ? 15_000 // segurança caso o navegador não avise o fim da fala
            : sound && tts.supported
              ? Math.max(700, reading - 4000)
              : reading;
    const timer = setTimeout(advance, ms);
    return () => clearTimeout(timer);
  }, [playing, finished, phase, index, tts.speaking, sound, tts.supported]);

  useEffect(() => {
    // Ao abrir, o título e o começo da conversa ficam visíveis.
    if (index === 0 && phase !== "tap") return;
    revealChatEnd();
  }, [index, phase]);

  // Contexto para o assistente: passo da demonstração que está na tela.
  useEffect(() => {
    setPracticeActivity({
      mode: "demo",
      current: index + 1,
      total: steps.length,
      engaged: false,
      stepTitle: finished ? "Demonstração concluída" : PARTS[index]?.label,
      prompt: step.bot_messages.join(" "),
      lesson: step.instruction,
    });
  }, [index, steps.length, step, finished]);

  useEffect(
    () => () => {
      setMascotSpeech(null);
      setPracticeActivity(null);
    },
    [],
  );

  function togglePlay() {
    if (finished) return replay();
    if (playing) {
      cancel();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    // Retoma relendo o passo atual.
    if (phase === "narrate" && sound) speak(step.instruction);
  }

  function replay() {
    cancel();
    setFinished(false);
    setIndex(0);
    setPhase(reduced ? "narrate" : "typing");
    setPlaying(!reduced);
  }

  // Histórico: passos anteriores com a resposta certa já enviada.
  const history: ChatLine[] = steps.slice(0, index).flatMap((past) => {
    const reply = expected(past);
    return [
      ...past.bot_messages.map((text) => ({ from: "bot" as const, text })),
      ...(reply ? [{ from: "user" as const, text: reply.label }] : []),
    ];
  });
  const showCurrent = phase !== "typing" || finished;
  const reply = expected(step);

  return (
    <div className="grid gap-3">
      <div className={styles.controls}>
        <p aria-live="polite">
          {finished
            ? "Demonstração concluída"
            : `Passo ${index + 1} de ${steps.length}`}
        </p>
        <div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Passo anterior"
            disabled={index === 0 && !finished}
            onClick={() => goTo(Math.max(0, finished ? index : index - 1))}
          >
            <SkipBack size={20} aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label={playing ? "Pausar" : "Continuar"}
            aria-pressed={!playing}
            onClick={togglePlay}
          >
            {playing ? (
              <Pause size={20} aria-hidden="true" />
            ) : (
              <Play size={20} aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Celebration burst={burst} />
        <ChatFrame label="Demonstração da conversa com a Clara">
          <ChatLines lines={history} />
          {showCurrent ? (
            <>
              <ChatLines
                lines={step.bot_messages.map((text) => ({ from: "bot", text }))}
              />
              {step.kind === "result" ? (
                <ResultCard lines={step.lines} />
              ) : (
                <QuickReplies
                  options={step.options.map((option) => ({
                    id: option.id,
                    label: option.label,
                    state:
                      phase === "tap" && option.id === reply?.id
                        ? "pointed"
                        : undefined,
                  }))}
                />
              )}
            </>
          ) : (
            <Typing />
          )}
        </ChatFrame>
      </div>

      <PageActions>
        {finished ? (
          <>
            <ActionLink variant="primary" href={partHref(PARTS[0].slug)}>
              Praticar parte por parte
            </ActionLink>
            <Button variant="secondary" onClick={replay}>
              Ver de novo
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => (last ? finish() : goTo(index + 1))}>
              {last ? "Concluir demonstração" : "Próximo passo"}
            </Button>
            <Button variant="secondary" onClick={replay}>
              Repetir do início
            </Button>
          </>
        )}
      </PageActions>
    </div>
  );
}
