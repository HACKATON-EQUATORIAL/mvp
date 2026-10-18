"use client";

import { Volume2, VolumeX } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Eletriquinho,
  type EletriquinhoMood,
} from "@/components/brand/eletriquinho";
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
import {
  getSoundEnabled,
  setSoundEnabled,
  useSoundEnabled,
} from "@/lib/feedback/preferences";
import {
  getPracticeActivity,
  usePracticeActivity,
} from "@/lib/practice/activity";
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
  const activity = getPracticeActivity();
  const where = activity
    ? `Você está na pergunta ${activity.current} de ${activity.total}. `
    : "";
  return `${where}Se sair agora, pode continuar a prática depois de onde parou. Quer ir para ${label.toLocaleLowerCase("pt-BR")}?`;
}

const sameScreen: InterpretationResult = {
  type: "information",
  message: "Você já está nesta tela. Posso ajudar com outra coisa?",
  showCatalog: false,
  optionIds: [],
  actionId: null,
};

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
  // Opções recusadas com "Nada disso" nesta página (não voltam a ser sugeridas).
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [rephrasing, setRephrasing] = useState(false);
  const practice = usePracticeActivity();
  const assistant = useVoiceAssistant();
  const speech = useSpeechToText();
  const tts = useSpeechSynthesis();
  // Preferência única de som (voz do assistente e efeitos da prática).
  const voiceReplies = useSoundEnabled();
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
    setRejectedIds([]);
    setRephrasing(false);
    setLastResponse(null);
  }, [
    locationKey,
    interpretation.reset,
    speech.dismissCapture,
    tts.cancel,
    assistant.reset,
  ]);

  if (!context) return null;
  const pageContext = {
    ...context,
    suggestions: options.filter((item) => !rejectedIds.includes(item.id)),
  };

  function resetPageSession() {
    tts.cancel();
    interpretation.reset();
    speech.dismissCapture();
    assistant.reset();
    setHistory([]);
    setPendingActionId(null);
    setPresentedOptionIds([]);
    setRejectedIds([]);
    setRephrasing(false);
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

  function startRecording(rephrase = false) {
    setRephrasing(rephrase);
    if (assistant.step === "welcome")
      setPresentedOptionIds(options.map((item) => item.id));
    tts.cancel();
    tts.prime();
    interpretation.reset();
    assistant.setStep("capture");
    void speech.startRecording();
  }

  /** "Nada disso": guarda as opções recusadas e pede outras palavras por voz. */
  function rejectOptions() {
    const shown = new Set([
      ...(assistant.step === "welcome"
        ? options.map((item) => item.id)
        : presentedOptionIds),
      ...(pendingActionId ? [pendingActionId] : []),
    ]);
    setRejectedIds((current) => [...new Set([...current, ...shown])]);
    setPendingActionId(null);
    setPresentedOptionIds([]);
    startRecording(true);
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
    if (current.href.split("?")[0] === pathname && !confirmed) {
      // Pedido da própria tela: navegar só apagaria a conversa.
      interpretation.reset();
      setPendingActionId(null);
      setLastResponse(sameScreen);
      setPresentedOptionIds([]);
      assistant.setStep("interpretation");
      speakReply(sameScreen.message);
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

  // Guard ligado ao estado real: só pergunta se há tentativa em andamento
  // com resposta ou ajuda já dada. A tentativa fica salva para retomar.
  function leavingPracticeTo(href: string) {
    return !!getPracticeActivity()?.engaged && href.split("?")[0] !== pathname;
  }

  function speakReply(text: string) {
    // Lê o valor atual: respostas assíncronas não usam o do render que as iniciou.
    if (getSoundEnabled()) tts.speak(text);
  }

  function listenAgain(text: string) {
    if (tts.speaking) tts.cancel();
    else speakReply(text);
  }

  function toggleVoiceReplies() {
    const next = !getSoundEnabled();
    if (!next) tts.cancel();
    setSoundEnabled(next);
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
        practice: practice
          ? {
              mode: practice.mode,
              current: practice.current,
              total: practice.total,
            }
          : null,
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
      ).filter((id) => allowed.has(id) && !rejectedIds.includes(id)),
      rejectedOptionIds: rejectedIds.filter((id) => allowed.has(id)),
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

  // Humor do Eletriquinho segue o estado real da conversa.
  const mascotMood: EletriquinhoMood = tts.speaking
    ? "talk"
    : assistant.step === "capture"
      ? speech.phase === "recording"
        ? "listen"
        : speech.phase === "transcribing"
          ? "think"
          : speech.phase === "error"
            ? "oops"
            : "happy"
      : assistant.step === "suggestion-confirmation"
        ? "think"
        : assistant.step === "interpretation"
          ? interpretation.state.status === "pending"
            ? "think"
            : interpretation.state.status === "error"
              ? "oops"
              : lastResponse?.type === "out_of_scope"
                ? "oops"
                : "happy"
          : "wave";

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
            {
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="voice-replies-button"
                aria-pressed={voiceReplies}
                aria-label={
                  voiceReplies
                    ? "Desativar sons e respostas em voz"
                    : "Ativar sons e respostas em voz"
                }
                onClick={toggleVoiceReplies}
              >
                {voiceReplies ? (
                  <Volume2 size={22} aria-hidden="true" />
                ) : (
                  <VolumeX size={22} aria-hidden="true" />
                )}
              </Button>
            }
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
          header={<Eletriquinho mood={mascotMood} size={92} />}
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
                onReject={rejectOptions}
              />
            </>
          ) : assistant.step === "capture" ? (
            <AudioRecorder
              phase={speech.phase}
              error={speech.error}
              canRetry={speech.canRetry}
              onBack={cancelCapture}
              onRetry={speech.retry}
              rephrase={rephrasing}
            />
          ) : assistant.step === "suggestion-confirmation" && selected ? (
            <VoiceSuggestionConfirmation
              suggestion={{
                ...selected,
                confirmation: leaveConfirmation(selected.label),
              }}
              onContinue={() => continueToAction(selected, true)}
              onBack={returnToOptions}
              onReject={rejectOptions}
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
              onReject={rejectOptions}
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
          onStart={() => startRecording()}
          onFinish={speech.finishRecording}
          onCancel={cancelCapture}
        />
      </DrawerContent>
    </Drawer>
  );
}
