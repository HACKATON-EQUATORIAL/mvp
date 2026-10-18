"use client";

import {
  Award,
  FileCheck,
  Lock,
  type LucideIcon,
  Search,
  Smartphone,
  Star,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { badgesOf, useJourneyProgress } from "../_lib/progress";
import styles from "./badges.module.css";

const icons: Record<string, LucideIcon> = {
  achei: Search,
  conferi: FileCheck,
  perfeita: Star,
  sozinho: Award,
  canal: Smartphone,
};

/** Faixa de selos da trilha: conquistados coloridos, os demais com cadeado. */
export function BadgeShelf() {
  const badges = badgesOf(useJourneyProgress());
  const reduced = useReducedMotion();
  const earned = badges.filter((badge) => badge.earned).length;
  return (
    <section className={styles.shelf} aria-label="Seus selos">
      <p className={styles.title}>
        Selos{" "}
        <span>
          {earned} de {badges.length}
        </span>
      </p>
      <ul className={styles.list}>
        {badges.map((badge, index) => {
          const Icon = badge.earned ? icons[badge.id] : Lock;
          return (
            <motion.li
              key={badge.id}
              className={styles.badge}
              data-earned={badge.earned || undefined}
              title={`${badge.label}: ${badge.detail}`}
              initial={reduced ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 16,
                delay: index * 0.06,
              }}
            >
              <span className={styles.medal} aria-hidden="true">
                <Icon size={22} />
              </span>
              <span className={styles.label}>{badge.label}</span>
              <span className="sr-only">
                {badge.earned ? "(conquistado)" : "(ainda não)"} {badge.detail}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
