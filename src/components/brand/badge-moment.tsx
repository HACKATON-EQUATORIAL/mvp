"use client";

import { Award } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { feedback } from "@/lib/feedback/sound";
import styles from "./brand.module.css";
import { Eletriquinho } from "./eletriquinho";

/** Eventos disparados pelo progresso (ver `segunda-via/_lib/progress.ts`). */
const BADGE_EVENT = "digitaliza:badge";

type Moment = { id: string; label: string };

/**
 * Celebrações curtas de selos, uma de cada vez. Só comemoram, nunca
 * cobram; somem sozinhas em poucos segundos ou ao toque.
 */
export function BadgeMoment() {
  const [queue, setQueue] = useState<Moment[]>([]);
  const reduced = useReducedMotion();
  const current = queue[0];

  useEffect(() => {
    function onBadge(event: Event) {
      const { id, label } = (event as CustomEvent<Moment>).detail;
      setQueue((items) => [...items, { id, label }]);
    }
    window.addEventListener(BADGE_EVENT, onBadge);
    return () => {
      window.removeEventListener(BADGE_EVENT, onBadge);
    };
  }, []);

  useEffect(() => {
    if (!current) return;
    feedback.sparkle();
    const timer = setTimeout(() => setQueue((items) => items.slice(1)), 3400);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <AnimatePresence mode="wait">
      {current && (
        <motion.button
          key={current.id}
          type="button"
          className={styles.badgeMoment}
          onClick={() => setQueue((items) => items.slice(1))}
          initial={
            reduced ? { opacity: 0 } : { y: -40, opacity: 0, scale: 0.9 }
          }
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { y: -30, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 360, damping: 22 }}
          aria-live="polite"
        >
          <motion.span
            className={styles.badgeIcon}
            aria-hidden="true"
            animate={
              reduced
                ? undefined
                : { scale: [0.6, 1.35, 1], rotate: [-8, 6, 0] }
            }
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Award size={34} />
          </motion.span>
          <span className={styles.badgeText}>
            <strong>Novo selo!</strong>
            <span>{current.label}</span>
          </span>
          <Eletriquinho mood="cheer" size={52} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
