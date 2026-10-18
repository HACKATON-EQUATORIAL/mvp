import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/layout/eyebrow";
import { ActionLink } from "@/components/ui/action-link";
import { VoiceHelp } from "@/components/voice/voice-help";
import type { VoicePageContext } from "@/components/voice/voice-page-context";
import styles from "./journey.module.css";

export const JOURNEY_ACTIONS_ID = "journey-actions";
/** Ponto de ancoragem do Eletriquinho: canto inferior do conteúdo, acima da barra. */
export const ASSISTANT_DOCK_ID = "assistant-dock";

type JourneyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
  actions: ReactNode;
  voiceContext?: VoicePageContext;
  voiceSlot?: ReactNode;
  /** Sub-ação no topo: volta a um nível da jornada (ex.: o mapa), dizendo o destino. */
  back?: { href: string; label: string };
  /** Etapa anterior da sequência, como botão secundário na barra de ações. */
  previous?: { href: string; label: string };
};

/**
 * Tela no formato de app: só o miolo rola; a barra de ações fica presa embaixo,
 * com espaço para o assistente na última linha. Componentes de cliente podem enviar botões para
 * a barra com `PageActions`.
 */
export function JourneyPage({
  eyebrow,
  title,
  intro,
  children,
  actions,
  voiceContext,
  voiceSlot,
  back,
  previous,
}: JourneyPageProps) {
  return (
    <main tabIndex={-1} className={`${styles.page} journey-page`}>
      <div className={styles.scroll} data-journey-scroll>
        {back && (
          <ActionLink
            href={back.href}
            variant="ghost"
            size="sm"
            className={styles.back}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            {back.label}
          </ActionLink>
        )}
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.intro}>{intro}</p>
        {children && <div className={styles.content}>{children}</div>}
      </div>
      <div id={ASSISTANT_DOCK_ID} className={styles.dock} />
      <div id={JOURNEY_ACTIONS_ID} className={styles.actions}>
        {actions}
        {previous && (
          <ActionLink
            href={previous.href}
            variant="secondary"
            className={styles.previous}
          >
            <ArrowLeft size={20} aria-hidden="true" />
            {/* No celular, só a seta aparece; o nome segue para leitores de tela. */}
            <span className={styles.previousLabel}>{previous.label}</span>
          </ActionLink>
        )}
      </div>
      {voiceSlot ??
        (voiceContext ? <VoiceHelp context={voiceContext} /> : null)}
    </main>
  );
}
