"use client";

import { SendHorizontal } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { revealInJourney } from "@/components/layout/journey-scroll";
import { cn } from "@/lib/utils";
import styles from "./chat.module.css";

/** Remetente como aparece no WhatsApp da Equatorial (cabeçalho e citações). */
export const SENDER = "Equatorial Energia Maranhão";
/** Pergunta respondida digitando (campo de mensagem), não por botão. */
export const DOCUMENT_ITEM = "item-documento";
/** Exemplo fixo: o treino nunca pede dado real. */
export const EXAMPLE_DOCUMENT = "000.000.000-00 (exemplo)";

export type ChatLine = {
  from: "bot" | "user";
  text: string;
  past?: boolean;
  /** Resposta do usuário: a mensagem da Equatorial que ela responde. */
  quote?: string;
};
export type ReplyOption = {
  id: string;
  label: string;
  state?: "correct" | "wrong" | "pointed";
};

// Hora das mensagens: a de quando a conversa abriu (como no print do WhatsApp).
const ChatTime = createContext("");
const clock = () =>
  new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * Moldura do WhatsApp simulado: cabeçalho da Equatorial, aviso de treino,
 * conversa (sem rolagem interna: cresce com a página) e, sempre embaixo, o campo
 * de mensagem com o botão de enviar.
 */
export function ChatFrame({
  label,
  composer,
  children,
}: {
  label: string;
  composer: ReactNode;
  children: ReactNode;
}) {
  const frame = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  const [time] = useState(clock);
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
        <span className={styles.avatar}>E</span>
        <span>
          <strong>{SENDER}</strong>
          <small>Clara · assistente virtual</small>
        </span>
      </div>
      <p className={styles.notice}>
        Simulação para treino · não é o canal oficial
      </p>
      <ChatTime.Provider value={time}>
        <div ref={body} className={styles.body}>
          {children}
        </div>
      </ChatTime.Provider>
      <div ref={foot} className={styles.footer}>
        {composer}
      </div>
    </section>
  );
}

/** Balões da conversa; cada um entra com uma pequena animação. */
export function ChatLines({ lines }: { lines: ChatLine[] }) {
  const reduced = useReducedMotion();
  const time = useContext(ChatTime);
  return lines.map((line, position) => (
    <motion.div
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
      {line.quote && (
        <span className={styles.quote}>
          <strong>{SENDER}</strong>
          <span>{line.quote}</span>
        </span>
      )}
      <p>
        <span className="sr-only">
          {line.from === "bot" ? `${SENDER}: ` : "Você: "}
        </span>
        {line.text}
      </p>
      <span className={styles.meta} aria-hidden="true">
        {time}
        {line.from === "user" && <span className={styles.ticks}>✓✓</span>}
      </span>
    </motion.div>
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

/** Dedo animado da demonstração (aponta onde a pessoa tocaria). */
function Finger() {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className={styles.finger}
      aria-hidden="true"
      initial={reduced ? false : { x: 40, y: 40, opacity: 0 }}
      animate={
        reduced
          ? { opacity: 1 }
          : { x: 0, y: [40, 0, 4, 0], opacity: 1, scale: [1, 1, 0.85, 1] }
      }
      transition={{ duration: 0.9, times: [0, 0.6, 0.8, 1] }}
    >
      👆
    </motion.span>
  );
}

/**
 * Respostas rápidas presas ao balão da Equatorial, como os botões do WhatsApp.
 * Na demonstração (`onChoose` ausente) são só ilustração, com o dedo animado
 * tocando a opção `pointed`.
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
  const interactive = !!onChoose;
  if (!options.length) return null;
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
          {option.state === "pointed" && <Finger />}
        </button>
      ))}
    </fieldset>
  );
}

/**
 * Campo de mensagem do WhatsApp, sempre visível. Só preenche o exemplo (nunca
 * dado real): parado quando a resposta é por botão; com `onFill`, tocar preenche
 * e o enviar fica ativo. `pointed` mostra o dedo da demonstração.
 */
export function Composer({
  value,
  onFill,
  onSend,
  waiting,
  pointed,
}: {
  /** Texto já preenchido (exemplo). */
  value?: string;
  /** Pergunta respondida digitando: tocar no campo preenche o exemplo. */
  onFill?: () => void;
  onSend?: () => void;
  /** A Clara está digitando. */
  waiting?: boolean;
  pointed?: "input" | "send";
}) {
  const placeholder = waiting
    ? "Aguarde a resposta da Clara…"
    : onFill
      ? "Toque para preencher o exemplo"
      : "Mensagem";
  return (
    <div className={styles.composer}>
      <button
        type="button"
        className={styles.composerInput}
        data-filled={value ? true : undefined}
        disabled={!onFill || !!value}
        tabIndex={onFill ? undefined : -1}
        aria-label={value ? `Mensagem: ${value}` : placeholder}
        onClick={onFill}
      >
        {value || placeholder}
        {pointed === "input" && <Finger />}
      </button>
      <button
        type="button"
        className={styles.composerSend}
        aria-label="Enviar mensagem"
        disabled={!onSend || !value}
        tabIndex={onSend ? undefined : -1}
        onClick={onSend}
      >
        <SendHorizontal size={20} aria-hidden="true" />
        {pointed === "send" && <Finger />}
      </button>
    </div>
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
