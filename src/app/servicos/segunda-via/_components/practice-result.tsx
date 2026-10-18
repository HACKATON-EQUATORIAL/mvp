"use client";

import { PartyPopper, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAttempt } from "@/http/practice/get-attempt";
import { routes, withContext } from "../_lib/navigation";
import { readAttemptId } from "../_lib/use-practice-session";
import styles from "./practice.module.css";

/**
 * Resultado só existe com tentativa individual concluída nesta sessão. Abrir a
 * tela direto (ou pelo assistente) convida a praticar, sem atribuir conclusão.
 */
export function PracticeResult() {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setAttemptId(readAttemptId("independent"));
    setLoaded(true);
  }, []);
  const query = useGetAttempt(attemptId ?? "", {
    enabled: !!attemptId,
    retry: false,
  });

  if (!loaded || (attemptId && query.isPending))
    return (
      <div role="status" aria-label="Carregando resultado">
        <Skeleton className="h-28 w-full" />
      </div>
    );

  const attempt = query.data;
  const channel = withContext(routes.canal, { origem: "pratica-concluida" });

  if (attempt?.status !== "completed")
    return (
      <div className={styles.practice}>
        <div className={styles.panel}>
          <h2 className={styles.prompt}>Você ainda não concluiu a prática</h2>
          <p>
            O resultado aparece quando você termina a prática individual. Ela
            leva poucos minutos.
          </p>
        </div>
        <ActionLink variant="primary" href={routes["pratica-guiada"]}>
          Começar a prática
        </ActionLink>
        <ActionLink href={routes.preparacao}>Ver a trilha</ActionLink>
      </div>
    );

  return (
    <div className={styles.practice}>
      <div className={`${styles.panel} ${styles.done}`} role="status">
        {attempt.assisted ? (
          <Sparkles size={40} aria-hidden="true" />
        ) : (
          <PartyPopper size={40} aria-hidden="true" />
        )}
        <h2>
          {attempt.assisted
            ? "Treino concluído com apoio"
            : "Treino concluído sem ajuda!"}
        </h2>
        <p>
          {attempt.progress.total} de {attempt.progress.total} perguntas
          respondidas na prática individual.
        </p>
        {attempt.outcome_label && <p>{attempt.outcome_label}</p>}
      </div>
      <ActionLink variant="primary" href={channel}>
        Usar o canal oficial
      </ActionLink>
      <ActionLink href={routes["pratica-individual"]}>
        {attempt.assisted ? "Tentar sem ajuda" : "Praticar de novo"}
      </ActionLink>
      <ActionLink
        href={withContext(routes.etapas, { origem: "pratica-concluida" })}
      >
        Revisar uma etapa
      </ActionLink>
    </div>
  );
}
