import type { ReactNode } from "react";

/** Bloco de uma etapa do assistente: a fala curta do Eletriquinho e as escolhas. */
export function VoiceStep({
  message,
  tone,
  action,
  children,
}: {
  message: ReactNode;
  tone?: "error";
  /** Ação no próprio balão (ex.: ouvir de novo). */
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="voice-step" aria-label="Resposta do assistente">
      <p
        className="voice-bubble"
        data-tone={tone}
        role={tone ? "alert" : "status"}
        tabIndex={-1}
      >
        <span>{message}</span>
        {action}
      </p>
      {children}
    </section>
  );
}

/** Chips de resposta rápida. */
export function VoiceChips({
  options,
  onSelect,
}: {
  options: { id: string; label: string }[];
  onSelect: (id: string) => void;
}) {
  if (!options.length) return null;
  return (
    <div className="voice-chips">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="voice-chip"
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Sim / Não lado a lado, para confirmar uma ação. */
export function VoiceYesNo({
  yes = "Sim",
  no = "Não",
  onYes,
  onNo,
}: {
  yes?: string;
  no?: string;
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <div className="voice-row">
      <button
        type="button"
        className="voice-chip"
        data-variant="primary"
        onClick={onYes}
      >
        {yes}
      </button>
      <button type="button" className="voice-chip" onClick={onNo}>
        {no}
      </button>
    </div>
  );
}
