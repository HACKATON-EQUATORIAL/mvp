"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/** Estados de carregamento e falha das consultas do serviço. */
export function LoadState({
  error,
  onRetry,
  label = "Carregando conteúdo",
}: {
  error?: boolean;
  onRetry?: () => void;
  label?: string;
}) {
  if (error)
    return (
      <div role="alert" className="grid gap-3">
        <p>Não foi possível carregar este conteúdo. Confira sua conexão.</p>
        {onRetry && <Button onClick={onRetry}>Tentar novamente</Button>}
      </div>
    );
  return (
    <div role="status" aria-label={label} className="grid gap-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
