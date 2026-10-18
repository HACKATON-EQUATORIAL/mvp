"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { routes } from "../_lib/navigation";
import { useMissedItems } from "../_lib/review";
import styles from "./badges.module.css";

/** Atalho para revisar só as perguntas erradas (aparece quando há alguma). */
export function ReviewCard() {
  const missed = useMissedItems();
  if (missed.length === 0) return null;
  return (
    <Link href={routes.revisao} className={styles.review}>
      <span className={styles.reviewIcon} aria-hidden="true">
        <RotateCcw size={22} />
      </span>
      <span>
        <strong>Revisar o que errei</strong>
        <span>
          {missed.length === 1
            ? "1 pergunta para treinar de novo"
            : `${missed.length} perguntas para treinar de novo`}
        </span>
      </span>
    </Link>
  );
}
