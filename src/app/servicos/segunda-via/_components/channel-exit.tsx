"use client";

import { ExternalLink, Info, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { PageActions } from "@/components/layout/page-actions";
import { ActionLink } from "@/components/ui/action-link";
import { useGetChannelExit } from "@/http/channel/get-channel-exit";
import { postEvent } from "@/http/events/post-events";
import { type NavigationContext, routes } from "../_lib/navigation";
import { TRACK_ID } from "../_lib/steps";
import styles from "./lesson.module.css";
import { LoadState } from "./load-state";

const originOf = (origem: NavigationContext["origem"]) =>
  origem === "pratica-concluida"
    ? "practice_completed"
    : origem === "dificuldades"
      ? "difficulty"
      : origem === "etapas"
        ? "consult"
        : "entry";

/** Saída para o canal oficial: URL só quando configurada no backend. */
export function ChannelExit({ context }: { context: NavigationContext }) {
  const query = useGetChannelExit(TRACK_ID);
  useEffect(() => {
    postEvent({
      type: "channel_exit_clicked",
      payload: { origin: originOf(context.origem) },
    });
  }, [context.origem]);
  if (!query.data)
    return (
      <LoadState error={query.isError} onRetry={() => void query.refetch()} />
    );
  const exit = query.data;
  return (
    <div className={styles.lesson}>
      <section className={styles.official} aria-label="Atendimento oficial">
        <p className={styles.officialTitle}>
          <ShieldCheck size={22} aria-hidden="true" />
          Atendimento oficial da Equatorial
        </p>
        <p className={styles.text}>{exit.requirements_notice}</p>
        <ul className={styles.channels}>
          <li>Agência Virtual: “Pagamento Simplificado”, sem login</li>
          <li>WhatsApp da Clara: número impresso na sua conta</li>
          <li>Aplicativo “Equatorial Energia”</li>
        </ul>
      </section>
      {exit.url ? (
        <a
          href={exit.url}
          target="_blank"
          rel="noopener noreferrer"
          data-slot="button"
          className="ui-button ui-button-primary"
        >
          {exit.label} <ExternalLink size={18} aria-hidden="true" />
        </a>
      ) : (
        <p className="flex gap-2 rounded-xl bg-[var(--warning-50)] p-4">
          <Info size={20} aria-hidden="true" className="mt-0.5 flex-none" />
          <span>
            Nesta demonstração o link do canal oficial ainda não foi
            configurado. Procure o atendimento digital da Equatorial pelos
            canais que você já conhece.
          </span>
        </p>
      )}
      <PageActions>
        <ActionLink variant="primary" href={routes.simulador}>
          Treinar antes no simulador
        </ActionLink>
      </PageActions>
      <ActionLink href="/">Escolher outra trilha</ActionLink>
    </div>
  );
}
