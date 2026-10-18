"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./brand.module.css";

export type FaiscaMood = "happy" | "cheer" | "think";

/** Faísca: guia da trilha (uma faísca de energia). Decorativa por padrão. */
export function Faisca({
  mood = "happy",
  size = 64,
  className,
}: {
  mood?: FaiscaMood;
  size?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn(styles.faisca, className)}
      animate={reduced ? undefined : { y: [0, -3, 0] }}
      transition={{
        duration: 2.4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <g fill="#ffd700" stroke="#86721f" strokeWidth="2" strokeLinejoin="round">
        <path d="M32 2 L36 13 L28 13 Z" />
        <path d="M58 22 L48 28 L46 20 Z" />
        <path d="M6 22 L18 20 L16 28 Z" />
        <path d="M50 52 L42 44 L48 40 Z" />
        <path d="M14 52 L16 40 L22 44 Z" />
        <circle cx="32" cy="34" r="20" />
      </g>
      <circle cx="24" cy="38" r="3" fill="#ffb066" opacity="0.7" />
      <circle cx="40" cy="38" r="3" fill="#ffb066" opacity="0.7" />
      {mood === "think" ? (
        <>
          <circle cx="27" cy="29" r="2.6" fill="#021045" />
          <circle cx="39" cy="29" r="2.6" fill="#021045" />
          <path
            d="M22 23 Q25 21 28 23"
            stroke="#021045"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="33" cy="41" r="2.4" fill="#021045" />
        </>
      ) : (
        <>
          <ellipse cx="26" cy="31" rx="2.6" ry="3.2" fill="#021045" />
          <ellipse cx="38" cy="31" rx="2.6" ry="3.2" fill="#021045" />
          {mood === "cheer" ? (
            <path d="M25 38 Q32 48 39 38 Z" fill="#021045" />
          ) : (
            <path
              d="M26 39 Q32 44 38 39"
              stroke="#021045"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
          )}
        </>
      )}
    </motion.svg>
  );
}

/** Balão da Faísca com uma dica curta. */
export function FaiscaTip({
  children,
  mood = "happy",
  className,
}: {
  children: ReactNode;
  mood?: FaiscaMood;
  className?: string;
}) {
  return (
    <div className={cn(styles.tip, className)}>
      <Faisca mood={mood} size={52} />
      <p className={styles.bubble}>{children}</p>
    </div>
  );
}
