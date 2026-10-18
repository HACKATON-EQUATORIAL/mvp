import { useCallback, useState } from "react";

export type VoiceAssistantStep =
  | "welcome"
  | "capture"
  | "interpretation"
  | "suggestion-confirmation";

export function useVoiceAssistant() {
  const [step, setStep] = useState<VoiceAssistantStep>("welcome");
  const [transcript, setTranscript] = useState("");

  const completeTranscript = useCallback((text: string) => {
    setTranscript(text);
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setStep("welcome");
  }, []);

  const returnToOptions = useCallback(() => {
    setStep("welcome");
  }, []);

  return {
    step,
    setStep,
    transcript,
    completeTranscript,
    reset,
    returnToOptions,
  };
}
