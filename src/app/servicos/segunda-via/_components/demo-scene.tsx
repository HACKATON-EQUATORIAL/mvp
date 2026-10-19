"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Celebration } from "@/components/brand/celebration";
import { PageActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/use-speech";
import { useGetBundle } from "@/http/track/get-bundle";
import { setMascotSpeech } from "@/lib/assistant/mascot-speech";
import { useSoundEnabled } from "@/lib/feedback/preferences";
import { feedback as sfx } from "@/lib/feedback/sound";
import { setPracticeActivity } from "@/lib/practice/activity";
import { END_SPEECH } from "@/lib/tts/fixed-phrases";
import type { TrackBundle } from "@/schemas/http/track";
import { updateProgress } from "../_lib/progress";
import { PARTS, partHref, TRACK_ID } from "../_lib/steps";
import styles from "./chat.module.css";
import { LoadState } from "./load-state";
import {
  ChatFrame,
  type ChatLine,
  ChatLines,
  Composer,
  QuickReplies,
  ResultCard,
  Typing,
} from "./whatsapp-chat";

type Phase = "typing" | "narrate" | "tap";
type Step = TrackBundle["simulations"][number]["steps"][number];

const TYPING_MS = 900;
const TAP_MS = 1400;
// Pausa curta depois que a voz termina, antes do próximo passo.
const AFTER_VOICE_MS = 500;
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
  const tts = useSpeech();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(reduced ? "narrate" : "typing");
  // Com movimento reduzido, nada avança sozinho.
  const [playing, setPlaying] = useState(!reduced);
  const [finished, setFinished] = useState(false);
  const [burst, setBurst] = useState(0);
  // Som bloqueado até um toque (página aberta direto): espera o ▶ para narrar.
  const [needsTap, setNeedsTap] = useState(false);
  const step = steps[index];
  const last = index === steps.length - 1;
  const { speak, cancel, preload } = tts;
  // Passo já narrado nesta passagem e se a voz chegou a tocar nele.
  const spoken = useRef<number | null>(null);
  const voiced = useRef(false);

  // Com som, gera todas as falas ao abrir (em fila, na ordem): a voz sai junto
  // com o balão, inclusive ao pular passos pelo player.
  useEffect(() => {
    if (sound) preload(...steps.map((item) => item.instruction), END_SPEECH);
  }, [sound, steps, preload]);

  function resetVoice() {
    spoken.current = null;
    voiced.current = false;
    setNeedsTap(false);
  }

  function goTo(next: number) {
    cancel();
    resetVoice();
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

  // Narração: balão e voz começam junto com o “digitando…” da Clara (sem
  // esperar a mensagem aparecer). Cada passo é lido uma vez por passagem.
  useEffect(() => {
    if (finished) {
      setMascotSpeech({ text: END_SPEECH, mood: "cheer" });
      if (sound) speak(END_SPEECH);
      return;
    }
    if (phase === "tap") return;
    setMascotSpeech({ text: step.instruction, mood: "talk" });
    if (!sound || !(playing || reduced) || spoken.current === index) return;
    // Sem nenhum toque nesta página, o navegador não deixa tocar som: em vez de
    // seguir mudo, a demonstração para no primeiro balão e espera o ▶.
    if (playing && navigator.userActivation?.hasBeenActive === false) {
      setPhase("narrate");
      setPlaying(false);
      setNeedsTap(true);
      return;
    }
    spoken.current = index;
    speak(step.instruction);
  }, [finished, phase, step, index, sound, playing, reduced, speak]);

  useEffect(() => {
    if (tts.speaking) voiced.current = true;
  }, [tts.speaking]);

  // O navegador recusou a voz mesmo assim: pausa e pede o ▶ (que relê o passo).
  useEffect(() => {
    if (!tts.blocked || !playing) return;
    spoken.current = null;
    setPlaying(false);
    setNeedsTap(true);
  }, [tts.blocked, playing]);

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
            : voiced.current
              ? AFTER_VOICE_MS // a fala terminou: segue logo
              : sound && tts.supported
                ? Math.max(700, reading - 4000)
                : reading;
    const timer = setTimeout(advance, ms);
    return () => clearTimeout(timer);
  }, [playing, finished, phase, index, tts.speaking, sound, tts.supported]);

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
      // Remontagem (ex.: Strict Mode no dev) lê o passo de novo: a desmontagem
      // pausou a voz, então o passo não conta como narrado.
      spoken.current = null;
      voiced.current = false;
    },
    [],
  );

  function togglePlay() {
    if (finished) return replay();
    if (playing) {
      cancel();
      // Ao retomar, o passo atual é relido.
      resetVoice();
      setPlaying(false);
      return;
    }
    setNeedsTap(false);
    setPlaying(true);
  }

  function replay() {
    cancel();
    resetVoice();
    setFinished(false);
    setIndex(0);
    setPhase(reduced ? "narrate" : "typing");
    setPlaying(!reduced);
  }

  // Histórico: passos anteriores com a resposta certa já enviada, citando a
  // mensagem respondida (como “responder” no WhatsApp).
  const history: ChatLine[] = steps.slice(0, index).flatMap((past) => {
    const reply = expected(past);
    return [
      ...past.bot_messages.map((text) => ({ from: "bot" as const, text })),
      ...(reply
        ? [
            {
              from: "user" as const,
              text: reply.label,
              quote: past.bot_messages.at(-1),
            },
          ]
        : []),
    ];
  });
  const showCurrent = phase !== "typing" || finished;
  const reply = expected(step);
  // Passo respondido digitando (documento): o dedo usa o campo de mensagem.
  const typed = step.options.length === 1;
  const tapping = phase === "tap" && !finished;

  function stepBack() {
    // Depois do fim, “voltar” reabre o último passo.
    goTo(finished ? index : Math.max(0, index - 1));
  }

  function stepForward() {
    if (finished) return;
    if (last) finish();
    else goTo(index + 1);
  }

  return (
    <div className="grid gap-3">
      <section className={styles.player} aria-label="Controles da demonstração">
        <ol className={styles.segments} aria-label="Passos">
          {steps.map((entry, position) => (
            <li key={entry.id}>
              <button
                type="button"
                aria-label={`Ir para o passo ${position + 1}`}
                aria-current={
                  !finished && position === index ? "step" : undefined
                }
                data-state={
                  finished || position < index
                    ? "done"
                    : position === index
                      ? "current"
                      : undefined
                }
                onClick={() => goTo(position)}
              />
            </li>
          ))}
        </ol>
        <div className={styles.playerRow}>
          <p aria-live="polite" data-attention={needsTap || undefined}>
            {finished
              ? "Demonstração concluída"
              : needsTap
                ? "Toque em ▶ para começar"
                : `Passo ${index + 1} de ${steps.length}`}
          </p>
          <div>
            <button
              type="button"
              className={styles.playerButton}
              aria-label="Reiniciar"
              onClick={replay}
            >
              <RotateCcw size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.playerButton}
              aria-label="Passo anterior"
              disabled={index === 0 && !finished}
              onClick={stepBack}
            >
              <SkipBack size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.playerButton}
              data-main
              data-attention={needsTap || undefined}
              aria-label={
                finished ? "Ver de novo" : playing ? "Pausar" : "Continuar"
              }
              onClick={togglePlay}
            >
              {playing ? (
                <Pause size={22} aria-hidden="true" />
              ) : (
                <Play size={22} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              className={styles.playerButton}
              aria-label="Próximo passo"
              disabled={finished}
              onClick={stepForward}
            >
              <SkipForward size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <div className="relative">
        <Celebration burst={burst} />
        <ChatFrame
          label="Demonstração da conversa com a Clara"
          composer={
            <Composer
              waiting={!showCurrent}
              value={typed && tapping ? reply?.label : undefined}
              pointed={typed && tapping ? "send" : undefined}
            />
          }
        >
          <ChatLines lines={history} />
          {showCurrent ? (
            <>
              <ChatLines
                lines={step.bot_messages.map((text) => ({ from: "bot", text }))}
              />
              {step.kind === "result" && <ResultCard lines={step.lines} />}
              {step.kind !== "result" && !typed && (
                <QuickReplies
                  options={step.options.map((option) => ({
                    id: option.id,
                    label: option.label,
                    state:
                      tapping && option.id === reply?.id
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
              Ir para a etapa 2
            </ActionLink>
            <Button variant="secondary" onClick={replay}>
              <RotateCcw size={18} aria-hidden="true" /> Ver de novo
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={finish}>
            Pular para o fim
          </Button>
        )}
      </PageActions>
    </div>
  );
}
