import { useCallback, useState } from "react";

export type VoiceAssistantStep =
  | "welcome"
  | "capture"
  | "review"
  | "transcript-confirmed"
  | "suggestion-confirmation";

export function useVoiceAssistant() {
  const [step, setStep] = useState<VoiceAssistantStep>("welcome");
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<
    string | null
  >(null);
  const [transcript, setTranscript] = useState("");

  const completeTranscript = useCallback((text: string) => {
    setTranscript(text);
    setStep("review");
  }, []);

  const selectSuggestion = useCallback((id: string) => {
    setSelectedSuggestionId(id);
    setStep("suggestion-confirmation");
  }, []);

  const returnToStableStep = useCallback(() => {
    setStep(transcript ? "review" : "welcome");
  }, [transcript]);

  const returnToOptions = useCallback(() => {
    setStep(transcript ? "transcript-confirmed" : "welcome");
  }, [transcript]);

  return {
    step,
    setStep,
    selectedSuggestionId,
    transcript,
    completeTranscript,
    selectSuggestion,
    returnToStableStep,
    returnToOptions,
  };
}
