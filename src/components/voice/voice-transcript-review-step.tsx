import { Button } from "@/components/ui/button";
import { TranscriptionPanel } from "./transcription-panel";
import { VoiceStep } from "./voice-step";

export function VoiceTranscriptReviewStep({
  text,
  onConfirm,
  onBack,
}: {
  text: string;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <VoiceStep
      title="Confira o que foi transcrito"
      description="Revise o texto antes de continuar. Ele ainda não executa nenhuma ação."
    >
      <TranscriptionPanel phase="success" text={text} />
      <Button type="button" variant="primary" onClick={onConfirm}>
        Confirmar transcrição
      </Button>
      <Button type="button" variant="secondary" onClick={onBack}>
        Voltar às opções
      </Button>
    </VoiceStep>
  );
}
