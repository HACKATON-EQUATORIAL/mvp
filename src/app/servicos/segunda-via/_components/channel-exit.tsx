"use client";

import {
  ExternalLink,
  Globe,
  Info,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
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

// O caminho treinado, para levar de cabeça ao canal real.
const steps = [
  "Toque em “Pagamento Simplificado” (não precisa de senha).",
  "Informe CPF ou CNPJ, estado e Unidade Consumidora ou Conta Contrato: estão na sua conta de luz.",
  "Escolha a fatura do mês que você procura.",
  "Antes de pagar, confira o mês de referência e a identificação.",
];

/** Saída para o atendimento oficial: abre o canal real configurado no backend. */
export function ChannelExit({ context }: { context: NavigationContext }) {
  const query = useGetChannelExit(TRACK_ID);
  if (!query.data)
    return (
      <LoadState error={query.isError} onRetry={() => void query.refetch()} />
    );
  const exit = query.data;
  const [main] = exit.destinations;

  function track() {
    postEvent({
      type: "channel_exit_clicked",
      payload: { origin: originOf(context.origem) },
    });
  }

  return (
    <div className={styles.lesson}>
      <section className={styles.official} aria-label="Atendimento oficial">
        <p className={styles.officialTitle}>
          <ShieldCheck size={22} aria-hidden="true" />
          Atendimento oficial da Equatorial
        </p>
        <p className={styles.text}>{exit.requirements_notice}</p>
      </section>

      {exit.destinations.length > 0 ? (
        <>
          <section className={styles.steps} aria-label="Como fazer no canal">
            <p className={styles.officialTitle}>Lembre do que você treinou</p>
            <ol>
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
          <ul className={styles.destinations}>
            {exit.destinations.map((dest) => (
              <li key={dest.id}>
                <a
                  href={dest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.destination}
                  data-kind={dest.kind}
                  onClick={track}
                >
                  <span className={styles.destinationIcon} aria-hidden="true">
                    {dest.kind === "whatsapp" ? (
                      <MessageCircle size={24} />
                    ) : (
                      <Globe size={24} />
                    )}
                  </span>
                  <span>
                    <strong>{dest.label}</strong>
                    <span>{dest.description}</span>
                  </span>
                  <ExternalLink size={18} aria-hidden="true" />
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
          {main && (
            <PageActions>
              <a
                href={main.url}
                target="_blank"
                rel="noopener noreferrer"
                data-slot="button"
                data-variant="primary"
                className="ui-button ui-button-primary"
                onClick={track}
              >
                Abrir{" "}
                {main.kind === "whatsapp" ? "o WhatsApp" : "a Agência Virtual"}
                <ExternalLink size={18} aria-hidden="true" />
              </a>
            </PageActions>
          )}
          <ActionLink href={routes.simulador}>
            Treinar antes no simulador
          </ActionLink>
        </>
      ) : (
        <>
          <p className="flex gap-2 rounded-xl bg-[var(--warning-50)] p-4">
            <Info size={20} aria-hidden="true" className="mt-0.5 flex-none" />
            <span>
              O link do canal oficial não está configurado neste ambiente.
              Procure o atendimento digital da Equatorial pelos canais que você
              já conhece.
            </span>
          </p>
          <PageActions>
            <ActionLink variant="primary" href={routes.simulador}>
              Treinar antes no simulador
            </ActionLink>
          </PageActions>
        </>
      )}
      <ActionLink href="/">Escolher outra trilha</ActionLink>
    </div>
  );
}
