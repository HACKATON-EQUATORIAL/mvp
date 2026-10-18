"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";
import { revealInJourney } from "@/components/layout/journey-scroll";
import { cn } from "@/lib/utils";
import styles from "./chat.module.css";

export type ChatLine = { from: "bot" | "user"; text: string; past?: boolean };
export type ReplyOption = {
  id: string;
  label: string;
  state?: "correct" | "wrong" | "pointed";
};

/**
 * Moldura do WhatsApp simulado: cabeçalho da Clara, aviso de treino, conversa
 * (sem rolagem interna: cresce com a página) e rodapé para respostas rápidas ou
 * o campo de mensagem.
 */
export function ChatFrame({
  label,
  footer,
  children,
}: {
  label: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const frame = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = body.current;
    if (!element) return;
    // Mensagem nova: a página (só o miolo, nunca o shell) desce até o fim do chat,
    // deixando à vista a última mensagem e as respostas. Ao abrir, não rola.
    const sync = () => revealInJourney(frame.current, false, 0, "auto");
    const observer = new MutationObserver(sync);
    observer.observe(element, { childList: true, subtree: true });
    if (foot.current)
      observer.observe(foot.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={frame}
      className={styles.device}
      aria-label={label}
      data-chat-screen
    >
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
      <div ref={body} className={styles.body}>
        {children}
      </div>
      <div ref={foot} className={styles.footer} hidden={!footer}>
        {footer}
      </div>
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
      transition={{ duration: 0.18, ease: "easeOut" }}
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
    <dl className={styles.result}>
      {lines.map((line) => (
        <div key={line.label} data-highlight={line.highlight || undefined}>
          <dt>{line.label}</dt>
          <dd>{line.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export { styles as chatStyles };
