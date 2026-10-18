"use client";

import { motion, useReducedMotion } from "motion/react";
import styles from "./brand.module.css";

const colors = ["#ffd700", "#19bc24", "#3473e8", "#ff7a00", "#0414a1"];

/** Explosão curta de “faíscas” ao acertar ou concluir. Some com reduced motion. */
export function Celebration({ burst = 0 }: { burst?: number }) {
  const reduced = useReducedMotion();
  if (reduced || burst === 0) return null;
  return (
    <div key={burst} className={styles.celebration} aria-hidden="true">
      {Array.from({ length: 16 }, (_, index) => {
        const angle = (index / 16) * Math.PI * 2;
        const distance = 70 + (index % 3) * 22;
        return (
          <motion.span
            // biome-ignore lint/suspicious/noArrayIndexKey: partículas fixas
            key={index}
            style={{ background: colors[index % colors.length] }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: 0.4,
              opacity: 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
