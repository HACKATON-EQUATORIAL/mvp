"use client";

import { Volume2, VolumeX, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PARTS } from "@/app/servicos/segunda-via/_lib/steps";
import {
  Eletriquinho,
  type EletriquinhoMood,
} from "@/components/brand/eletriquinho";
import { ASSISTANT_DOCK_ID } from "@/components/layout/journey-page";
import { findVisibleById } from "@/components/layout/journey-target";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { assistantAiEnabled } from "@/config/assistant";
import { useIdle } from "@/hooks/use-idle";
import { useSpeech } from "@/hooks/use-speech";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useVoiceAssistant } from "@/hooks/use-voice-assistant";
import { useVoiceCatalog } from "@/hooks/use-voice-catalog";
import { useVoiceInterpretation } from "@/hooks/use-voice-interpretation";
import { useGetBundle } from "@/http/track/get-bundle";
import {
  leaveConfirmation,
  NO_ANSWER_FALLBACK,
} from "@/lib/assistant/fixed-replies";
import { isInternalVoiceHref } from "@/lib/assistant/interpret-client";
import {
  buildVoiceActions,
  localVoiceOptions,
  type VoiceAction,
} from "@/lib/assistant/journey";
import {
  setMascotSpeech,
  useMascotSpeech,
} from "@/lib/assistant/mascot-speech";
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
  notifyAssistantHelp,
  usePracticeActivity,
} from "@/lib/practice/activity";
import { DEFAULT_HELP, SAME_SCREEN_MESSAGE } from "@/lib/tts/fixed-phrases";
import { MascotButton, MascotCorner } from "./assistant-mascot";
import { AudioRecorder } from "./audio-recorder";
import { useVoicePage } from "./voice-assistant-provider";
import { VoiceAudioDock } from "./voice-audio-dock";
import { VoiceConversation } from "./voice-conversation";
import { VoiceInterpretationStep } from "./voice-interpretation-step";
import { VoiceChips, VoiceStep } from "./voice-step";
import { VoiceSuggestionConfirmation } from "./voice-suggestion-confirmation";
import { VoiceWelcomeStep } from "./voice-welcome-step";

const sameScreen: InterpretationResult = {
  type: "information",
  message: SAME_SCREEN_MESSAGE,
  showCatalog: false,
  optionIds: [],
  actionId: null,
};

// Tempo parado até o Eletriquinho oferecer a dica da tela.
const IDLE_TIP_MS = 30_000;

const activeSpeechPhases = new Set(["requesting", "recording", "transcribing"]);

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/**
 * Última barreira: se a fala citar o rótulo da opção esperada da prática, troca
 * pela dica do item. A LLM não recebe a resposta, mas pode adivinhar.
 */
function withoutAnswer(
  result: InterpretationResult,
  activity: ReturnType<typeof getPracticeActivity>,
): InterpretationResult {
  const expected = activity?.expected && normalize(activity.expected);
  if (!expected || activity.mode === "demo") return result;
  if (!normalize(result.message).includes(expected)) return result;
  return {
    ...result,
    message: activity.hint ?? NO_ANSWER_FALLBACK,
  };
}

export function VoiceAssistantHost() {
  const { context } = useVoicePage();
  const mascotSpeech = useMascotSpeech();
  const router = useRouter();
  const pathname = usePathname();
  // Âncora do Eletriquinho na tela atual (criada por JourneyPage).
  const [dock, setDock] = useState<HTMLElement | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: reavalia a cada tela/contexto
  useEffect(() => {
    setDock(findVisibleById(ASSISTANT_DOCK_ID));
  }, [pathname, context?.id]);
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
  const tts = useSpeech();
  // Preferência única de som (voz do assistente e efeitos da prática).
  const voiceReplies = useSoundEnabled();
  const interpretation = useVoiceInterpretation();
  const { catalog, retry } = useVoiceCatalog(used);
  const bundle = useGetBundle("segunda-via", { enabled: used });
  // Lista de dificuldades aberta (ajuda sem IA).
  const [problems, setProblems] = useState(false);
  const actions = context ? buildVoiceActions(context, catalog) : [];
  const options = context ? localVoiceOptions(context, actions) : [];
  const currentActions = useRef(actions);
  const currentPending = useRef(pendingActionId);
  currentActions.current = actions;
  currentPending.current = pendingActionId;
  const selected = actions.find((item) => item.id === pendingActionId);
  const here = actions.find((item) => item.href.split("?")[0] === pathname);
  const locationKey = `${pathname}:${context?.id}`;
  const idle = useIdle(IDLE_TIP_MS, locationKey);
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
    setProblems(false);
  }, [
    locationKey,
    interpretation.reset,
    speech.dismissCapture,
    tts.cancel,
    assistant.reset,
  ]);

  // Falas prováveis desta tela (ajuda local, “já está aqui”) ficam prontas
  // antes do toque: arquivos pré-gerados, baixados com prioridade baixa.
  const { preload } = tts;
  const helpTexts = [
    practice?.hint,
    practice?.explanation,
    practice?.lesson,
    context?.screen?.teaches,
  ];
  const helpKey = helpTexts.join("|");
  // biome-ignore lint/correctness/useExhaustiveDependencies: helpKey resume os textos
  useEffect(() => {
    if (getSoundEnabled()) preload(...helpTexts, SAME_SCREEN_MESSAGE);
  }, [helpKey, preload]);
  const guidance = bundle.data?.difficulties.map((item) => item.guidance);
  useEffect(() => {
    if (problems && guidance && getSoundEnabled()) preload(...guidance);
  }, [problems, guidance, preload]);

  // Fala viva com `speak` (ex.: dica pedida na etapa 2): o balão também é lido
  // em voz alta. Trocar ou limpar essa fala corta a voz.
  const { speak: speakNow, cancel: cancelSpeech } = tts;
  const spokenSpeech = useRef<typeof mascotSpeech>(null);
  useEffect(() => {
    const before = spokenSpeech.current;
    spokenSpeech.current = mascotSpeech;
    if (mascotSpeech?.speak) {
      if (getSoundEnabled()) speakNow(mascotSpeech.text);
    } else if (before?.speak) cancelSpeech();
  }, [mascotSpeech, speakNow, cancelSpeech]);

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
    setProblems(false);
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
    // A resposta virá da LLM: a conexão com a voz já fica aberta.
    if (getSoundEnabled()) tts.warm();
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

  /** Resposta montada no navegador (IA desligada): mesmo balão e chips da LLM. */
  function showLocal(message: string, optionIds: string[] = []) {
    const local: InterpretationResult = {
      type: "help",
      message,
      optionIds: optionIds.filter((id) => id !== here?.id).slice(0, 3),
      actionId: null,
      showCatalog: false,
    };
    interpretation.reset();
    setPendingActionId(null);
    setProblems(false);
    setLastResponse(local);
    setPresentedOptionIds(local.optionIds);
    assistant.setStep("interpretation");
    speakReply(message);
  }

  /** Ajuda local: dica do item, instrução do passo ou o que a tela ensina. */
  function localHelp() {
    const activity = getPracticeActivity();
    // Dica dada numa prática conta como apoio (mesma regra da resposta da LLM).
    if (activity && activity.mode !== "demo") notifyAssistantHelp();
    showLocal(
      (activity && activity.mode !== "demo"
        ? activity.hint
        : activity?.lesson) ??
        context?.screen?.teaches ??
        context?.tip ??
        DEFAULT_HELP,
      // Depois da ajuda, os mesmos caminhos da tela continuam à mão.
      options.map((item) => item.id),
    );
  }

  /** Dificuldade escolhida: orientação do conteúdo e o caminho que resolve. */
  function showDifficulty(id: string) {
    const item = bundle.data?.difficulties.find((entry) => entry.id === id);
    if (!item) return;
    const part = PARTS.find(
      (entry) => entry.stepId === item.destination.step_id,
    );
    const target =
      item.destination.kind === "step" && part
        ? `segunda-via.parte.${part.slug}`
        : item.destination.kind === "overview"
          ? "segunda-via.demonstracao"
          : "segunda-via.conclusao";
    showLocal(
      item.guidance,
      actions.some((action) => action.id === target) ? [target] : [],
    );
  }

  /**
   * Atalho “Me explica esta tela” / “Me dá uma dica”: o pedido já é conhecido,
   * então responde com a ajuda local (dica, lição ou o que a tela ensina, com
   * áudio pré-gerado), sem transcrição nem LLM. Só a fala no microfone vai à IA.
   */
  function explainScreen() {
    tts.prime();
    localHelp();
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

  /**
   * Botão de som do balão: muta/desmuta o app (mesma preferência do alto-falante
   * do assistente). Desmutar volta a ler o balão. Fala de abertura esperando o
   * primeiro toque (som bloqueado pelo navegador): o toque no botão a libera.
   */
  function toggleCornerSound(text?: string) {
    if (mascotSpeech?.waitTap) {
      setSoundEnabled(true);
      setMascotSpeech({ ...mascotSpeech, speak: true, waitTap: false });
      return;
    }
    const next = !getSoundEnabled();
    setSoundEnabled(next);
    if (!next) tts.cancel();
    else if (text) tts.speak(text);
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
        screen: context.screen ?? null,
        // A opção esperada (`expected`) fica no navegador; nunca vai à LLM.
        practice: practice
          ? {
              mode: practice.mode,
              current: practice.current,
              total: practice.total,
              stepTitle: practice.stepTitle,
              prompt: practice.prompt,
              hint: practice.hint,
              lesson: practice.lesson,
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
    if (getSoundEnabled()) tts.warm();
    const raw = await interpretation.interpret(input);
    if (!raw) return;
    // Chips nunca levam à própria tela.
    const here = actions.find((item) => item.href.split("?")[0] === pathname);
    const result = withoutAnswer(
      {
        ...raw,
        optionIds: raw.optionIds.filter((id) => id !== here?.id),
      },
      getPracticeActivity(),
    );
    setHistory((current) =>
      [...current, { user: input.text, assistant: result }].slice(
        -MAX_CONVERSATION_TURNS,
      ),
    );
    if (result.type === "help" && getPracticeActivity()?.mode !== "demo")
      notifyAssistantHelp();
    setLastResponse(result);
    setPresentedOptionIds(
      result.showCatalog
        ? catalog.tracks
            .flatMap((track) => {
              const action = actions.find(
                (item) => item.id === `${track.id}.canal`,
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

  // Mostra a resposta já filtrada (`withoutAnswer`), guardada em lastResponse.
  const interpretationState =
    (interpretation.state.status === "idle" ||
      interpretation.state.status === "success") &&
    lastResponse
      ? { status: "success" as const, result: lastResponse }
      : interpretation.state;

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      showSwipeHandle
      swipeDirection="down"
    >
      {(() => {
        // O Eletriquinho fica no canto do conteúdo (âncora da tela) e fala pelo balão.
        const cornerText =
          mascotSpeech?.text ?? (idle ? context.tip : undefined);
        const corner = (
          <MascotCorner
            // Fala viva (narração, dica pedida, comemoração) aparece na hora; a dica
            // da tela só quando a pessoa fica um tempo parada.
            text={cornerText}
            hidden={open}
            holdOpen={tts.speaking || !!mascotSpeech?.waitTap}
            soundOn={voiceReplies}
            onSound={() => toggleCornerSound(cornerText)}
            compact={!!practice}
          >
            <DrawerTrigger
              render={
                <MascotButton
                  aria-label="Abrir assistente Eletriquinho"
                  aria-expanded={open}
                  mood={mascotSpeech?.mood ?? "happy"}
                />
              }
            />
          </MascotCorner>
        );
        return dock ? createPortal(corner, dock) : corner;
      })()}
      <DrawerContent className="voice-drawer-popup">
        <DrawerHeader className="voice-drawer-header">
          <span className="voice-header-mascot" aria-hidden="true">
            <Eletriquinho mood={mascotMood} size={40} />
          </span>
          <DrawerTitle>Eletriquinho</DrawerTitle>
          <div className="voice-header-actions">
            {
              <button
                type="button"
                className="voice-icon-button"
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
              </button>
            }
            <DrawerClose
              render={
                <button
                  type="button"
                  className="voice-icon-button"
                  aria-label="Fechar assistente"
                >
                  <X size={22} aria-hidden="true" />
                </button>
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
          {problems ? (
            <VoiceStep message="O que aconteceu?">
              <VoiceChips
                options={(bundle.data?.difficulties ?? []).map(
                  ({ id, label }) => ({ id, label }),
                )}
                onSelect={showDifficulty}
              />
              <button
                type="button"
                className="voice-link"
                onClick={() => setProblems(false)}
              >
                Voltar
              </button>
            </VoiceStep>
          ) : assistant.step === "welcome" ? (
            catalog.state === "error" ? (
              <VoiceStep
                tone="error"
                message="Não consegui atualizar os serviços. As opções desta tela continuam valendo."
              >
                <VoiceChips
                  options={[{ id: "retry", label: "Tentar de novo" }]}
                  onSelect={retry}
                />
              </VoiceStep>
            ) : (
              <VoiceWelcomeStep
                context={pageContext}
                inPractice={!!practice && practice.mode !== "demo"}
                onSelectSuggestion={selectSuggestion}
                onExplain={explainScreen}
                onProblem={
                  assistantAiEnabled ? undefined : () => setProblems(true)
                }
                onReject={assistantAiEnabled ? rejectOptions : undefined}
              />
            )
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
              onReject={assistantAiEnabled ? rejectOptions : undefined}
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
        {assistantAiEnabled && (
          <VoiceAudioDock
            phase={speech.phase}
            seconds={speech.seconds}
            stream={speech.mediaStream}
            hasTranscript={!!assistant.transcript}
            onStart={() => startRecording()}
            onFinish={speech.finishRecording}
            onCancel={cancelCapture}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
