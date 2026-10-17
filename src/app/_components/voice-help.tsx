"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AudioRecorder } from "@/app/_components/audio-recorder";
import { Button } from "@/app/_components/button";
import styles from "@/app/_components/layout/journey.module.css";
import { VoiceHelpButton } from "@/app/_components/voice-help-button";

export function VoiceHelp() {
  const pathname = usePathname();
  return <VoiceHelpSession key={pathname} />;
}

function VoiceHelpSession() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const id = useId();

  useEffect(() => {
    if (open) heading.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    button.current?.focus();
  }

  return (
    <div className={`${styles.voice} journey-voice`}>
      <VoiceHelpButton
        ref={button}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? close() : setOpen(true))}
      />
      <div id={id} hidden={!open}>
        {open && (
          <section
            className={styles.voiceRegion}
            aria-labelledby={`${id}-heading`}
          >
            <h2 id={`${id}-heading`} ref={heading} tabIndex={-1}>
              Gravar e transcrever
            </h2>
            <p>
              Disponível agora: gravar e transcrever. O texto não executa ações
              nem gera orientações automaticamente.
            </p>
            <p>Fechar descarta a gravação e a transcrição desta sessão.</p>
            <Button variant="secondary" onClick={close}>
              Fechar gravação
            </Button>
            <AudioRecorder />
          </section>
        )}
      </div>
    </div>
  );
}
