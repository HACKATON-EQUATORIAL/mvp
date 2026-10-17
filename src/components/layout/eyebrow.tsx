import type { ReactNode } from "react";
import styles from "./journey.module.css";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className={styles.eyebrow}>{children}</p>;
}
