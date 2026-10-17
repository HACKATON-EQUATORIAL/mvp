import { Button } from "@/components/ui/button";
import type { SpeechPhase } from "@/hooks/use-speech-to-text";
import { VoiceStep } from "./voice-step";

export function AudioRecorder({
  phase,
  error,
  canRetry,
  onBack,
  onRetry,
}: {
  phase: SpeechPhase;
  error: string;
  canRetry: boolean;
  onBack: () => void;
  onRetry: () => void;
}) {
  return (
    <VoiceStep
      title={
        phase === "requesting"
          ? "Vamos começar?"
          : phase === "recording"
            ? "Estou ouvindo…"
            : phase === "transcribing"
              ? "Transcrevendo seu pedido…"
              : phase === "error"
                ? "Vamos tentar de novo?"
                : "A gravação foi interrompida"
      }
      description={
        phase === "requesting"
          ? "Permita o microfone para contar o que você precisa."
          : phase === "recording"
            ? "Fale no seu ritmo. Quando terminar, toque em parar."
            : phase === "transcribing"
              ? "Em instantes, você poderá conferir o que foi identificado."
              : "Você pode gravar outra mensagem ou voltar às opções."
      }
    >
      {error ? (
        <p className="voice-error" role="alert">
          {error}
        </p>
      ) : (
        <div className="voice-transcribing-panel" role="status">
          <p>
            {phase === "transcribing"
              ? "Identificando sua fala"
              : "Sua transcrição aparecerá aqui"}
          </p>
          <div
            className="voice-transcript-placeholder"
            data-pending={phase === "transcribing"}
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      {canRetry && (
        <Button type="button" onClick={onRetry}>
          Tentar enviar novamente
        </Button>
      )}
      {phase !== "recording" &&
        phase !== "requesting" &&
        phase !== "transcribing" && (
          <Button type="button" variant="secondary" onClick={onBack}>
            Voltar às opções
          </Button>
        )}
    </VoiceStep>
  );
}
