import { Button } from "@/components/ui/button";
import type { SpeechPhase } from "@/hooks/use-speech-to-text";

type RecordingControlsProps = {
  phase: SpeechPhase;
  seconds: number;
  pending: boolean;
  canRetry: boolean;
  onStart: () => void;
  onFinish: () => void;
  onCancel: () => void;
  onRetry: () => void;
};

export function RecordingControls({
  phase,
  seconds,
  pending,
  canRetry,
  onStart,
  onFinish,
  onCancel,
  onRetry,
}: RecordingControlsProps) {
  return (
    <>
      {phase === "recording" && (
        <p className="recording-status" role="status">
          <span className="recording-dot" aria-hidden="true" />
          Gravando · {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </p>
      )}
      <Button
        type="button"
        variant="primary"
        size="recording"
        disabled={pending}
        onClick={phase === "recording" ? onFinish : onStart}
      >
        {phase === "recording"
          ? "Parar e transcrever"
          : phase === "requesting"
            ? "Aguardando microfone…"
            : phase === "transcribing"
              ? "Transcrevendo…"
              : phase === "success" || phase === "error"
                ? "Gravar novamente"
                : "Gravar áudio"}
      </Button>
      {(phase === "recording" || pending) && (
        <Button
          type="button"
          variant="secondary"
          size="recording-secondary"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      )}
      {canRetry && (
        <Button
          type="button"
          variant="secondary"
          size="recording-secondary"
          onClick={onRetry}
        >
          Tentar enviar novamente
        </Button>
      )}
    </>
  );
}
