"use client";

import { useEffect, useState } from "react";
import { Celebration } from "@/components/brand/celebration";
import { Eletriquinho, EletriquinhoTip } from "@/components/brand/eletriquinho";
import { PageActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAttempt } from "@/http/practice/get-attempt";
import { routes, withContext } from "../_lib/navigation";
import { readAttemptId } from "../_lib/use-practice-session";
import styles from "./practice.module.css";
import { ReviewCard } from "./review-card";

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
        <EletriquinhoTip mood="think">
          Seu resultado aparece quando você termina a prática individual. Leva
          poucos minutos!
        </EletriquinhoTip>
        <PageActions>
          <ActionLink variant="primary" href={routes["pratica-guiada"]}>
            Começar a prática
          </ActionLink>
          <ActionLink href={routes.preparacao}>Ver a trilha</ActionLink>
        </PageActions>
      </div>
    );

  return (
    <div className={styles.practice}>
      <div className={`${styles.panel} ${styles.done}`} role="status">
        <Celebration burst={1} />
        <Eletriquinho mood="cheer" size={96} />
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
      <PageActions>
        <ActionLink variant="primary" href={channel}>
          Usar o canal oficial
        </ActionLink>
        <ActionLink href={routes.simulador}>Treinar no simulador</ActionLink>
      </PageActions>
      <ReviewCard />
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
