"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ActionLink } from "@/app/_components/action-link";
import { Button } from "@/app/_components/button";
import { InfoCard } from "@/app/_components/info-card";
import styles from "@/app/_components/layout/journey.module.css";
import { practiceFeedback } from "../_lib/content";
import { routes, withContext } from "../_lib/navigation";

export function PracticeChoice({ guided }: { guided: boolean }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [hint, setHint] = useState(false);
  const hintRef = useRef<HTMLParagraphElement>(null);

  function select() {
    router.push(
      guided ? routes["pratica-conferencia"] : routes["pratica-concluida"],
    );
  }

  const correct = (
    <Button
      key="segunda-via"
      variant={guided ? "primary" : "secondary"}
      onClick={select}
    >
      Segunda via
    </Button>
  );
  const alternative = (
    <Button
      key="debitos"
      variant="secondary"
      onClick={() =>
        setFeedback(
          guided ? practiceFeedback.guided : practiceFeedback.individual,
        )
      }
    >
      Consultar débitos
    </Button>
  );

  return (
    <div className={styles.practice}>
      <p role="status" className={styles.feedback}>
        {feedback}
      </p>
      {hint && (
        <InfoCard>
          <p tabIndex={-1} ref={hintRef}>
            {practiceFeedback.hint}
          </p>
        </InfoCard>
      )}
      {guided ? [correct, alternative] : [alternative, correct]}
      {guided ? (
        <Button
          variant="secondary"
          aria-expanded={hint}
          onClick={() => {
            setHint(true);
            requestAnimationFrame(() => hintRef.current?.focus());
          }}
        >
          Ver uma dica
        </Button>
      ) : (
        <ActionLink
          href={withContext(`${routes.etapas}/encontrar`, {
            origem: "pratica-individual",
            etapa: "encontrar",
          })}
        >
          Pedir ajuda
        </ActionLink>
      )}
      <ActionLink href="/">Sair da prática</ActionLink>
    </div>
  );
}
