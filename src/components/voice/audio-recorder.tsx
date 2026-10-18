import { Button } from "@/components/ui/button";
import type { SpeechPhase } from "@/hooks/use-speech-to-text";
import { VoiceStep } from "./voice-step";

export function AudioRecorder({
  phase,
  error,
  canRetry,
  onBack,
  onRetry,
  rephrase = false,
}: {
  phase: SpeechPhase;
  error: string;
  canRetry: boolean;
  onBack: () => void;
  onRetry: () => void;
  rephrase?: boolean;
}) {
  return (
    <VoiceStep
      title={
        phase === "requesting"
          ? "Vamos começar?"
          : phase === "recording"
            ? rephrase
              ? "Diga com outras palavras"
              : "Estou ouvindo…"
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
            ? rephrase
              ? "Conte o que você procura, do seu jeito. Vou sugerir caminhos diferentes."
              : "Fale no seu ritmo. Quando terminar, toque em parar."
            : phase === "transcribing"
              ? "Estou identificando seu pedido."
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
              : "Estou acompanhando sua fala"}
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
