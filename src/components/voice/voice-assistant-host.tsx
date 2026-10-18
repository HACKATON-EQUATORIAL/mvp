"use client";

import { Volume2, VolumeX } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useVoiceAssistant } from "@/hooks/use-voice-assistant";
import { useVoiceCatalog } from "@/hooks/use-voice-catalog";
import { useVoiceInterpretation } from "@/hooks/use-voice-interpretation";
import { isInternalVoiceHref } from "@/lib/assistant/interpret-client";
import {
  buildVoiceActions,
  localVoiceOptions,
  type VoiceAction,
} from "@/lib/assistant/journey";
import {
  type ConversationTurn,
  type InterpretationRequest,
  type InterpretationResult,
  MAX_CONVERSATION_TURNS,
} from "@/lib/assistant/schemas";
import { AudioRecorder } from "./audio-recorder";
import { useVoicePage } from "./voice-assistant-provider";
import { VoiceAudioDock } from "./voice-audio-dock";
import { VoiceConversation } from "./voice-conversation";
import { VoiceHelpButton } from "./voice-help-button";
import { VoiceInterpretationStep } from "./voice-interpretation-step";
import { VoiceStep } from "./voice-step";
import { VoiceSuggestionConfirmation } from "./voice-suggestion-confirmation";
import { VoiceWelcomeStep } from "./voice-welcome-step";

function leaveConfirmation(label: string) {
  return `Sair desta tela pode interromper a prática atual. Quer continuar para ${label.toLocaleLowerCase("pt-BR")}?`;
}

const activeSpeechPhases = new Set(["requesting", "recording", "transcribing"]);

export function VoiceAssistantHost() {
  const { context } = useVoicePage();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [used, setUsed] = useState(false);
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [lastResponse, setLastResponse] = useState<InterpretationResult | null>(
    null,
  );
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [presentedOptionIds, setPresentedOptionIds] = useState<string[]>([]);
  const assistant = useVoiceAssistant();
  const speech = useSpeechToText();
  const tts = useSpeechSynthesis();
  const [voiceReplies, setVoiceReplies] = useState(true);
  // Ref: respostas assíncronas devem ver o mute atual, não o do render que as iniciou.
  const voiceRepliesRef = useRef(true);
  const interpretation = useVoiceInterpretation();
  const { catalog, retry } = useVoiceCatalog(used);
  const actions = context ? buildVoiceActions(context, catalog) : [];
  const options = context ? localVoiceOptions(context, actions) : [];
  const currentActions = useRef(actions);
  const currentPending = useRef(pendingActionId);
  currentActions.current = actions;
  currentPending.current = pendingActionId;
  const selected = actions.find((item) => item.id === pendingActionId);
  const locationKey = `${pathname}:${context?.id}:${JSON.stringify(context?.navigation)}`;
  const previousLocation = useRef(locationKey);

  const transcriptionHandler = useRef<((text: string) => void) | null>(null);
  const transcriptionHandled = useRef(false);
  transcriptionHandler.current = (text) => {
    assistant.completeTranscript(text);
    void interpretTranscript(text);
  };
  useEffect(() => {
    if (speech.phase !== "success") {
      transcriptionHandled.current = false;
      return;
    }
    if (
      !transcriptionHandled.current &&
      speech.text &&
      open &&
      assistant.step === "capture" &&
      previousLocation.current === locationKey
    ) {
      transcriptionHandled.current = true;
      transcriptionHandler.current?.(speech.text);
    }
  }, [speech.phase, speech.text, open, assistant.step, locationKey]);

  // Keep the host mounted, but scope conversation memory to the current page/context.
  useEffect(() => {
    if (previousLocation.current === locationKey) return;
    previousLocation.current = locationKey;
    interpretation.reset();
    speech.dismissCapture();
    tts.cancel();
    setPendingActionId(null);
    setOpen(false);
    assistant.reset();
    setHistory([]);
    setPresentedOptionIds([]);
    setLastResponse(null);
  }, [
    locationKey,
    interpretation.reset,
    speech.dismissCapture,
    tts.cancel,
    assistant.reset,
  ]);

  if (!context) return null;
  const pageContext = { ...context, suggestions: options };

  function resetPageSession() {
    tts.cancel();
    interpretation.reset();
    speech.dismissCapture();
    assistant.reset();
    setHistory([]);
    setPendingActionId(null);
    setPresentedOptionIds([]);
    setLastResponse(null);
    transcriptionHandled.current = false;
  }

  function returnToOptions() {
    setPendingActionId(null);
    setPresentedOptionIds(options.map((item) => item.id));
    interpretation.reset();
    assistant.returnToOptions();
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setUsed(true);
      if (assistant.step === "welcome" && !lastResponse)
        setPresentedOptionIds(options.map((item) => item.id));
      setOpen(true);
      return;
    }
    if (
      speech.phase === "success" &&
      speech.text &&
      assistant.step === "capture"
    )
      assistant.completeTranscript(speech.text);
    if (
      activeSpeechPhases.has(speech.phase) ||
      assistant.step === "capture" ||
      interpretation.state.status === "pending"
    ) {
      assistant.setStep(
        pendingActionId
          ? "suggestion-confirmation"
          : lastResponse
            ? "interpretation"
            : "welcome",
      );
    }
    interpretation.cancel();
    speech.dismissCapture();
    tts.cancel();
    setOpen(false);
  }

  function startRecording() {
    if (assistant.step === "welcome")
      setPresentedOptionIds(options.map((item) => item.id));
    tts.cancel();
    tts.prime();
    interpretation.reset();
    assistant.setStep("capture");
    void speech.startRecording();
  }

  function cancelCapture() {
    speech.cancel();
    assistant.setStep(
      pendingActionId
        ? "suggestion-confirmation"
        : lastResponse
          ? "interpretation"
          : "welcome",
    );
  }

  function selectSuggestion(id: string) {
    const action = currentActions.current.find((item) => item.id === id);
    if (action) continueToAction(action);
  }

  function continueToAction(action: VoiceAction, confirmed = false) {
    const current = currentActions.current.find(
      (item) => item.id === action.id,
    );
    if (
      !current ||
      !isInternalVoiceHref(current.href) ||
      (confirmed && currentPending.current !== action.id)
    ) {
      returnToOptions();
      return;
    }
    if (leavingPracticeTo(current.href) && !confirmed) {
      interpretation.reset();
      setPendingActionId(current.id);
      setPresentedOptionIds([]);
      setLastResponse(null);
      assistant.setStep("suggestion-confirmation");
      speakReply(leaveConfirmation(current.label));
      return;
    }
    resetPageSession();
    setOpen(false);
    router.push(current.href);
  }

  function leavingPracticeTo(href: string) {
    return (
      !!context?.id.startsWith("segunda-via.pratica-") &&
      !context.id.startsWith("segunda-via.pratica-concluida") &&
      href.split("?")[0] !== pathname
    );
  }

  function speakReply(text: string) {
    if (voiceRepliesRef.current) tts.speak(text);
  }

  function listenAgain(text: string) {
    if (tts.speaking) tts.cancel();
    else speakReply(text);
  }

  function toggleVoiceReplies() {
    const next = !voiceRepliesRef.current;
    voiceRepliesRef.current = next;
    if (!next) tts.cancel();
    setVoiceReplies(next);
  }

  async function interpretTranscript(text: string) {
    if (!context) return;
    const cleanActions = actions.map(
      ({ id, label, confirmation, description }) => ({
        id,
        label,
        confirmation,
        description,
      }),
    );
    const allowed = new Set(actions.map((item) => item.id));
    const input: InterpretationRequest = {
      text,
      context: {
        id: context.id,
        description: context.description,
        suggestions: options.map(({ id, label, confirmation }) => ({
          id,
          label,
          confirmation,
        })),
      },
      catalog,
      actions: cleanActions,
      history,
      pendingActionId:
        pendingActionId && allowed.has(pendingActionId)
          ? pendingActionId
          : null,
      presentedOptionIds: (assistant.step === "welcome"
        ? options.map((item) => item.id)
        : presentedOptionIds
      ).filter((id) => allowed.has(id)),
    };
    assistant.setStep("interpretation");
    const result = await interpretation.interpret(input);
    if (!result) return;
    setHistory((current) =>
      [...current, { user: input.text, assistant: result }].slice(
        -MAX_CONVERSATION_TURNS,
      ),
    );
    setLastResponse(result);
    setPresentedOptionIds(
      result.showCatalog
        ? catalog.tracks
            .flatMap((track) => {
              const action = actions.find(
                (item) => item.id === `${track.id}.preparacao`,
              );
              return track.status === "available" && action ? [action.id] : [];
            })
            .slice(0, 3)
        : result.optionIds,
    );
    if (result.type === "confirmation") {
      const action = currentActions.current.find(
        (item) => item.id === result.actionId,
      );
      if (action && result.actionId === currentPending.current)
        continueToAction(action, true);
      else returnToOptions();
      return;
    }
    if (result.type === "proposal") {
      const action = currentActions.current.find(
        (item) => item.id === result.actionId,
      );
      if (action) continueToAction(action);
      else returnToOptions();
      return;
    }
    if (result.type === "confirmation_request") {
      const action = currentActions.current.find(
        (item) => item.id === result.actionId,
      );
      if (!action) {
        returnToOptions();
        return;
      }
      // Fica pendente: o usuário confirma pelo botão ou dizendo "sim".
      setPendingActionId(action.id);
      speakReply(result.message);
      return;
    }
    setPendingActionId(null);
    speakReply(result.message);
  }

  const interpretationState =
    interpretation.state.status === "idle" && lastResponse
      ? { status: "success" as const, result: lastResponse }
      : interpretation.state;

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
          <div className="voice-header-actions">
            {tts.supported && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="voice-replies-button"
                aria-pressed={voiceReplies}
                aria-label={
                  voiceReplies
                    ? "Desativar respostas em voz"
                    : "Ativar respostas em voz"
                }
                onClick={toggleVoiceReplies}
              >
                {voiceReplies ? (
                  <Volume2 size={22} aria-hidden="true" />
                ) : (
                  <VolumeX size={22} aria-hidden="true" />
                )}
              </Button>
            )}
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
          </div>
        </DrawerHeader>
        <VoiceConversation
          stage={
            assistant.step === "capture"
              ? `capture-${speech.phase}`
              : assistant.step === "interpretation"
                ? `interpretation-${interpretationState.status}`
                : assistant.step
          }
        >
          {assistant.transcript && assistant.step !== "capture" && (
            <p className="voice-heard" title={assistant.transcript}>
              Você disse: <q>{assistant.transcript}</q>
            </p>
          )}
          {assistant.step === "welcome" ? (
            <>
              {catalog.state === "loading" ? (
                <div role="status" aria-label="Carregando opções do assistente">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="mt-3 h-12 w-full" />
                </div>
              ) : null}
              {catalog.state === "error" ? (
                <VoiceStep
                  title="Não consegui atualizar as trilhas"
                  description="Você ainda pode usar os caminhos conhecidos desta tela."
                >
                  <Button variant="secondary" onClick={retry}>
                    Tentar novamente
                  </Button>
                </VoiceStep>
              ) : null}
              <VoiceWelcomeStep
                context={pageContext}
                onSelectSuggestion={selectSuggestion}
              />
            </>
          ) : assistant.step === "capture" ? (
            <AudioRecorder
              phase={speech.phase}
              error={speech.error}
              canRetry={speech.canRetry}
              onBack={cancelCapture}
              onRetry={speech.retry}
            />
          ) : assistant.step === "suggestion-confirmation" && selected ? (
            <VoiceSuggestionConfirmation
              suggestion={{
                ...selected,
                confirmation: leaveConfirmation(selected.label),
              }}
              onContinue={() => continueToAction(selected, true)}
              onBack={returnToOptions}
            />
          ) : (
            <VoiceInterpretationStep
              state={interpretationState}
              actions={actions}
              catalog={catalog}
              onSelectSuggestion={selectSuggestion}
              onRetry={() => void interpretTranscript(assistant.transcript)}
              onCancel={() => {
                interpretation.cancel();
                assistant.setStep(lastResponse ? "interpretation" : "welcome");
              }}
              onBack={returnToOptions}
              onConfirm={(id) => {
                const action = currentActions.current.find(
                  (item) => item.id === id,
                );
                if (action) continueToAction(action, true);
              }}
              canListen={tts.supported && voiceReplies}
              speaking={tts.speaking}
              onListen={() =>
                interpretationState.status === "success" &&
                listenAgain(interpretationState.result.message)
              }
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
