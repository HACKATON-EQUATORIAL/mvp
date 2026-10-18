"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./chat.module.css";

export type ChatLine = { from: "bot" | "user"; text: string; past?: boolean };
export type ReplyOption = {
  id: string;
  label: string;
  state?: "correct" | "wrong" | "pointed";
};

/** Moldura do WhatsApp simulado: cabeçalho da Clara e aviso fixo de treino. */
export function ChatFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.device} aria-label={label}>
      <div className={styles.header} aria-hidden="true">
        <span className={styles.avatar}>C</span>
        <span>
          <strong>Clara · Equatorial</strong>
          <small>assistente virtual</small>
        </span>
      </div>
      <p className={styles.notice}>
        Simulação para treino · não é o canal oficial
      </p>
      <div className={styles.body}>{children}</div>
    </section>
  );
}

/** Balões da conversa; cada um entra com uma pequena animação. */
export function ChatLines({ lines }: { lines: ChatLine[] }) {
  const reduced = useReducedMotion();
  return lines.map((line, position) => (
    <motion.p
      // A conversa só cresce; a posição identifica cada balão.
      // biome-ignore lint/suspicious/noArrayIndexKey: lista append-only
      key={position}
      className={cn(
        styles.bubble,
        line.from === "user" && styles.user,
        line.past && styles.past,
      )}
      initial={reduced ? false : { opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      <span className="sr-only">
        {line.from === "bot" ? "Clara: " : "Você: "}
      </span>
      {line.text}
    </motion.p>
  ));
}

/** “Digitando…” da Clara. */
export function Typing() {
  return (
    <p className={cn(styles.bubble, styles.typing)} role="status">
      <span />
      <span />
      <span />
      <span className="sr-only">Clara está digitando</span>
    </p>
  );
}

/**
 * Respostas rápidas. Na demonstração (`onChoose` ausente) são só ilustração,
 * com o dedo animado tocando a opção `pointed`.
 */
export function QuickReplies({
  options,
  onChoose,
  locked,
}: {
  options: ReplyOption[];
  onChoose?: (id: string) => void;
  locked?: boolean;
}) {
  const reduced = useReducedMotion();
  const interactive = !!onChoose;
  return (
    <fieldset
      className={styles.replies}
      aria-hidden={interactive ? undefined : true}
      data-chat-end
    >
      {interactive && <legend className="sr-only">Escolha uma resposta</legend>}
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={styles.reply}
          data-state={option.state}
          tabIndex={interactive ? undefined : -1}
          disabled={!interactive || locked || option.state === "wrong"}
          aria-pressed={interactive ? !!option.state : undefined}
          onClick={() => onChoose?.(option.id)}
        >
          {option.label}
          {option.state === "pointed" && (
            <motion.span
              className={styles.finger}
              aria-hidden="true"
              initial={reduced ? false : { x: 40, y: 40, opacity: 0 }}
              animate={
                reduced
                  ? { opacity: 1 }
                  : {
                      x: 0,
                      y: [40, 0, 4, 0],
                      opacity: 1,
                      scale: [1, 1, 0.85, 1],
                    }
              }
              transition={{ duration: 0.9, times: [0, 0.6, 0.8, 1] }}
            >
              👆
            </motion.span>
          )}
        </button>
      ))}
    </fieldset>
  );
}

/** Resultado enviado pela Clara (fatura com destaques para conferir). */
export function ResultCard({
  lines,
}: {
  lines: { label: string; value: string; highlight: boolean }[];
}) {
  return (
    <dl className={styles.result} data-chat-end>
      {lines.map((line) => (
        <div key={line.label} data-highlight={line.highlight || undefined}>
          <dt>{line.label}</dt>
          <dd>{line.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Mantém a mensagem mais nova visível dentro do miolo rolável. */
export function revealChatEnd() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  requestAnimationFrame(() =>
    document.querySelector("[data-chat-end]")?.scrollIntoView({
      block: "nearest",
      behavior: reduced ? "auto" : "smooth",
    }),
  );
}

export { styles as chatStyles };
