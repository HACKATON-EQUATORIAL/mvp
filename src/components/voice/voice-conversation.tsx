"use client";

import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import brand from "@/components/brand/brand.module.css";

export function VoiceConversation({
  stage,
  header,
  children,
}: {
  stage: string;
  /** Fica fora da transição entre etapas (ex.: o Eletriquinho persistente). */
  header?: ReactNode;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const container = useRef<HTMLElement>(null);
  const previous = useRef(stage);

  useLayoutEffect(() => {
    if (previous.current === stage) return;
    previous.current = stage;
    // Move focus before outgoing controls are unmounted; do not steal focus on open.
    container.current?.focus({ preventScroll: true });
    container.current?.scrollTo({ top: 0 });
  }, [stage]);

  return (
    <section
      className="voice-drawer-scroll"
      ref={container}
      tabIndex={-1}
      aria-label="Conversa com o assistente"
    >
      {header && <div className={brand.drawerMascot}>{header}</div>}
      <AnimatePresence initial={false} mode="wait">
        <ConversationContent key={stage} reducedMotion={!!reducedMotion}>
          {children}
        </ConversationContent>
      </AnimatePresence>
    </section>
  );
}

function ConversationContent({
  reducedMotion,
  children,
}: {
  reducedMotion: boolean;
  children: ReactNode;
}) {
  const present = useIsPresent();
  return (
    <motion.div
      inert={!present}
      aria-hidden={!present}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
      transition={{ duration: reducedMotion ? 0 : 0.16 }}
    >
      {children}
    </motion.div>
  );
}
