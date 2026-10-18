"use client";

import {
  CheckCircle2,
  Globe,
  Lightbulb,
  MessageCircle,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { Button } from "@/components/ui/button";
import { useGetChannelSimulations } from "@/http/track/get-channel-simulations";
import { cn } from "@/lib/utils";
import type { ChannelSimulation, SimulationStep } from "@/schemas/http/track";
import { routes, withContext } from "../_lib/navigation";
import { updateProgress } from "../_lib/progress";
import { TRACK_ID } from "../_lib/steps";
import { LoadState } from "./load-state";
import styles from "./simulator.module.css";

type ChatLine = { from: "bot" | "user"; text: string };

/**
 * Treino guiado dos canais oficiais, desenhado a partir do conteúdo da API.
 * Dados fictícios; passos não conferidos aparecem como ilustrativos.
 */
export function ChannelSimulator() {
  const query = useGetChannelSimulations(TRACK_ID);
  const [selected, setSelected] = useState<string | null>(null);

  if (!query.data)
    return (
      <LoadState error={query.isError} onRetry={() => void query.refetch()} />
    );
  const simulation = query.data.items.find((item) => item.id === selected);

  if (!simulation)
    return (
      <div className={styles.picker}>
        {query.data.items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.channel}
            onClick={() => setSelected(item.id)}
          >
            {item.channel === "whatsapp" ? (
              <MessageCircle size={28} aria-hidden="true" />
            ) : (
              <Globe size={28} aria-hidden="true" />
            )}
            <span>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </span>
          </button>
        ))}
        {query.data.items.length === 0 && (
          <p role="status">Nenhuma simulação disponível no momento.</p>
        )}
      </div>
    );

  return (
    <Simulation
      key={simulation.id}
      simulation={simulation}
      others={query.data.items.filter((item) => item.id !== simulation.id)}
      onSwitch={setSelected}
    />
  );
}

function Simulation({
  simulation,
  others,
  onSwitch,
}: {
  simulation: ChannelSimulation;
  others: ChannelSimulation[];
  onSwitch: (id: string | null) => void;
}) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const [filled, setFilled] = useState(false);
  const [chat, setChat] = useState<ChatLine[]>([]);
  const whatsapp = simulation.channel === "whatsapp";
  const step = simulation.steps[index];
  const done = index >= simulation.steps.length;

  function advance(userText?: string) {
    setChat((lines) => [
      ...lines,
      ...step.bot_messages.map((text) => ({ from: "bot" as const, text })),
      ...(userText ? [{ from: "user" as const, text: userText }] : []),
    ]);
    setFeedback(null);
    setFilled(false);
    const next = index + 1;
    setIndex(next);
    if (next >= simulation.steps.length)
      updateProgress({ simulated: [simulation.id] });
  }

  function choose(optionId: string) {
    const option = step.options.find((item) => item.id === optionId);
    if (!option) return;
    if (!option.is_expected) {
      setFeedback({
        ok: false,
        text: option.feedback ?? "Essa não é a opção certa. Tente outra.",
      });
      return;
    }
    if (whatsapp) {
      advance(option.label);
      return;
    }
    setFeedback({ ok: true, text: option.feedback ?? "Isso mesmo!" });
  }

  if (done)
    return (
      <div className={styles.done} role="status">
        <CheckCircle2 size={40} aria-hidden="true" />
        <h2>Treino concluído: {simulation.title}</h2>
        <p>
          Agora é só repetir no canal oficial, com os seus dados. Lembre de
          conferir o mês de referência e a identificação.
        </p>
        <ActionLink
          variant="primary"
          href={withContext(routes.canal, { origem: "pratica-concluida" })}
        >
          Ir ao canal oficial
        </ActionLink>
        {others.map((item) => (
          <Button
            key={item.id}
            variant="secondary"
            onClick={() => onSwitch(item.id)}
          >
            Treinar também: {item.title}
          </Button>
        ))}
        <ActionLink href={routes.preparacao}>Ver a trilha</ActionLink>
      </div>
    );

  return (
    <div className={styles.simulator}>
      <p className={styles.badge}>
        <ShieldAlert size={16} aria-hidden="true" />
        Simulação para treino · não é o canal oficial
      </p>
      <p className={styles.counter}>
        Passo {index + 1} de {simulation.steps.length}
        {!step.verified && (
          <span className={styles.illustrative}>Etapa ilustrativa</span>
        )}
      </p>
      <p className={styles.tutor}>
        <Lightbulb size={20} aria-hidden="true" />
        <span>{step.instruction}</span>
      </p>

      <section
        className={cn(styles.device, whatsapp && styles.chatDevice)}
        aria-label={`Tela simulada: ${step.title}`}
      >
        <p className={styles.screenTitle}>{step.title}</p>
        {whatsapp ? (
          <ChatScreen history={chat} step={step} onChoose={choose} />
        ) : (
          <SiteScreen
            step={step}
            filled={filled}
            onChoose={choose}
            answered={feedback?.ok === true}
          />
        )}
      </section>

      {feedback && (
        <p
          role="status"
          className={cn(styles.feedback, feedback.ok ? styles.ok : styles.no)}
        >
          {feedback.text}
        </p>
      )}

      <div className={styles.actions}>
        {step.kind === "form" && !filled && (
          <Button onClick={() => setFilled(true)}>
            Preencher com dados de exemplo
          </Button>
        )}
        {((step.kind === "form" && filled) ||
          step.kind === "result" ||
          (step.kind === "choose" && feedback?.ok)) && (
          <Button onClick={() => advance()}>
            {step.kind === "result" ? "Concluir treino" : "Continuar"}
          </Button>
        )}
        <Button variant="ghost" onClick={() => onSwitch(null)}>
          Escolher outro canal
        </Button>
      </div>
      <details className={styles.source}>
        <summary>De onde vêm estas telas?</summary>
        <p>{simulation.source}</p>
      </details>
    </div>
  );
}

function SiteScreen({
  step,
  filled,
  answered,
  onChoose,
}: {
  step: SimulationStep;
  filled: boolean;
  answered: boolean;
  onChoose: (id: string) => void;
}) {
  if (step.kind === "form")
    return (
      <div className={styles.form}>
        {step.fields.map((field) => (
          <label key={field.id} className={styles.field}>
            <span>{field.label}</span>
            <input
              readOnly
              value={filled ? field.example : ""}
              placeholder="Toque em preencher abaixo"
            />
            {field.help && <small>{field.help}</small>}
          </label>
        ))}
      </div>
    );
  if (step.kind === "result") return <ResultLines step={step} />;
  return (
    <div className={styles.tiles}>
      {step.options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={styles.tile}
          data-correct={answered && option.is_expected ? "" : undefined}
          disabled={answered}
          onClick={() => onChoose(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ChatScreen({
  history,
  step,
  onChoose,
}: {
  history: ChatLine[];
  step: SimulationStep;
  onChoose: (id: string) => void;
}) {
  return (
    <div className={styles.chat}>
      {[
        ...history,
        ...step.bot_messages.map((text) => ({ from: "bot" as const, text })),
      ].map((line, position) => (
        <p
          // A conversa só cresce; a posição identifica cada balão.
          // biome-ignore lint/suspicious/noArrayIndexKey: lista append-only
          key={position}
          className={cn(styles.bubble, line.from === "user" && styles.user)}
        >
          {line.text}
        </p>
      ))}
      {step.kind === "result" ? (
        <ResultLines step={step} />
      ) : (
        <div className={styles.replies}>
          {step.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={styles.reply}
              onClick={() => onChoose(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultLines({ step }: { step: SimulationStep }) {
  return (
    <dl className={styles.result}>
      {step.lines.map((line) => (
        <div key={line.label} data-highlight={line.highlight || undefined}>
          <dt>{line.label}</dt>
          <dd>{line.value}</dd>
        </div>
      ))}
    </dl>
  );
}
