"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useVoiceAssistant } from "@/hooks/use-voice-assistant";
import { AudioRecorder } from "./audio-recorder";
import { VoiceAudioDock } from "./voice-audio-dock";
import { VoiceConversation } from "./voice-conversation";
import { VoiceHelpButton } from "./voice-help-button";
import type {
  VoicePageContext,
  VoicePageSuggestion,
} from "./voice-page-context";
import { VoiceSuggestionConfirmation } from "./voice-suggestion-confirmation";
import { VoiceTranscriptConfirmedStep } from "./voice-transcript-confirmed-step";
import { VoiceTranscriptReviewStep } from "./voice-transcript-review-step";
import { VoiceWelcomeStep } from "./voice-welcome-step";

const activeSpeechPhases = new Set(["requesting", "recording", "transcribing"]);

export function VoiceHelp({ context }: { context: VoicePageContext }) {
  return <VoiceHelpSession key={context.id} context={context} />;
}

function VoiceHelpSession({ context }: { context: VoicePageContext }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const assistant = useVoiceAssistant();
  const speech = useSpeechToText();
  const selectedSuggestion = context.suggestions.find(
    (suggestion) => suggestion.id === assistant.selectedSuggestionId,
  );

  useEffect(() => {
    if (speech.phase === "success" && speech.text) {
      assistant.completeTranscript(speech.text);
    }
  }, [assistant.completeTranscript, speech.phase, speech.text]);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      if (speech.phase === "success" && speech.text) {
        assistant.completeTranscript(speech.text);
      }
      setOpen(true);
      return;
    }

    if (speech.phase === "success" && speech.text) {
      assistant.completeTranscript(speech.text);
    } else if (
      activeSpeechPhases.has(speech.phase) ||
      assistant.step === "capture"
    ) {
      assistant.returnToStableStep();
    }
    speech.dismissCapture();
    setOpen(false);
  }

  function startRecording() {
    assistant.setStep("capture");
    void speech.startRecording();
  }

  function cancelCapture() {
    speech.cancel();
    assistant.returnToStableStep();
  }

  function continueToSuggestion(suggestion: VoicePageSuggestion) {
    speech.dismissCapture();
    setOpen(false);
    router.push(suggestion.href);
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerTrigger
        render={
          <VoiceHelpButton aria-label="Abrir assistente" aria-expanded={open} />
        }
      />
      <DrawerContent className="voice-drawer-popup">
        <DrawerHeader className="voice-drawer-header">
          <DrawerTitle>Assistente Digitaliza Aí</DrawerTitle>
          <DrawerClose
            render={
              <Button
                type="button"
                variant="secondary"
                className="voice-close-button"
              >
                Fechar
              </Button>
            }
          />
        </DrawerHeader>
        <VoiceConversation
          stage={
            assistant.step === "capture"
              ? `capture-${speech.phase}`
              : assistant.step
          }
        >
          {assistant.step === "welcome" ? (
            <VoiceWelcomeStep
              context={context}
              onSelectSuggestion={assistant.selectSuggestion}
            />
          ) : assistant.step === "capture" ? (
            <AudioRecorder
              phase={speech.phase}
              error={speech.error}
              canRetry={speech.canRetry}
              onBack={cancelCapture}
              onRetry={speech.retry}
            />
          ) : assistant.step === "review" ? (
            <VoiceTranscriptReviewStep
              text={assistant.transcript}
              onConfirm={() => assistant.setStep("transcript-confirmed")}
              onBack={() => assistant.setStep("welcome")}
            />
          ) : assistant.step === "transcript-confirmed" ? (
            <VoiceTranscriptConfirmedStep
              text={assistant.transcript}
              context={context}
              onSelectSuggestion={assistant.selectSuggestion}
            />
          ) : selectedSuggestion ? (
            <VoiceSuggestionConfirmation
              suggestion={selectedSuggestion}
              onContinue={() => continueToSuggestion(selectedSuggestion)}
              onBack={assistant.returnToOptions}
            />
          ) : (
            <VoiceWelcomeStep
              context={context}
              onSelectSuggestion={assistant.selectSuggestion}
            />
          )}
        </VoiceConversation>
        <VoiceAudioDock
          phase={speech.phase}
          seconds={speech.seconds}
          stream={speech.mediaStream}
          hasTranscript={!!assistant.transcript}
          onStart={startRecording}
          onFinish={speech.finishRecording}
          onCancel={cancelCapture}
        />
      </DrawerContent>
    </Drawer>
  );
}
