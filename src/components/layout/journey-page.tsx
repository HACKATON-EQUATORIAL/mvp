import type { ReactNode } from "react";
import { Eyebrow } from "@/components/layout/eyebrow";
import { VoiceHelp } from "@/components/voice/voice-help";
import type { VoicePageContext } from "@/components/voice/voice-page-context";
import styles from "./journey.module.css";

export const JOURNEY_ACTIONS_ID = "journey-actions";

type JourneyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
  actions: ReactNode;
  voiceContext?: VoicePageContext;
  voiceSlot?: ReactNode;
};

/**
 * Tela no formato de app: só o miolo rola; a barra de ações fica presa embaixo,
 * com espaço para o microfone. Componentes de cliente podem enviar botões para
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
}: JourneyPageProps) {
  return (
    <main tabIndex={-1} className={`${styles.page} journey-page`}>
      <div className={styles.scroll} data-journey-scroll>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.intro}>{intro}</p>
        {children && <div className={styles.content}>{children}</div>}
      </div>
      <div id={JOURNEY_ACTIONS_ID} className={styles.actions}>
        {actions}
      </div>
      {voiceSlot ??
        (voiceContext ? <VoiceHelp context={voiceContext} /> : null)}
    </main>
  );
}
