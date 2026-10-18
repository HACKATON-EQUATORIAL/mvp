"use client";

import { useEffect, useRef, useState } from "react";
import { useGetAttempt } from "@/http/practice/get-attempt";
import {
  useAbandonAttempt,
  useCreateAttempt,
  useRequestHelp,
  useSubmitAction,
} from "@/http/practice/practice-commands";
import { ApiError } from "@/lib/error/api-error";
import { setPracticeActivity } from "@/lib/practice/activity";
import type {
  AttemptState,
  HelpKind,
  PracticeMode,
} from "@/schemas/http/practice";
import { TRACK_ID } from "./steps";

const storageKey = (mode: PracticeMode) => `digitaliza:attempt:${mode}`;

export function readAttemptId(mode: PracticeMode) {
  try {
    return sessionStorage.getItem(storageKey(mode));
  } catch {
    return null;
  }
}

function writeAttemptId(mode: PracticeMode, id: string | null) {
  try {
    if (id) sessionStorage.setItem(storageKey(mode), id);
    else sessionStorage.removeItem(storageKey(mode));
  } catch {
    // Sem sessionStorage a tentativa continua válida até recarregar a página.
  }
}

type Answer = {
  item: NonNullable<AttemptState["current_item"]>;
  optionId: string;
  correct: boolean;
  message: string;
};

/**
 * Sessão de prática ligada ao motor do backend. Retoma a tentativa salva no
 * navegador ou cria uma nova; o acerto vem sempre da resposta da API.
 */
export function usePracticeSession(mode: PracticeMode) {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [help, setHelp] = useState<{ kind: HelpKind; content: string } | null>(
    null,
  );
  const engaged = useRef(false);

  const query = useGetAttempt(attemptId ?? "", {
    enabled: !!attemptId,
    retry: false,
  });
  const create = useCreateAttempt({
    onSuccess: (state) => {
      writeAttemptId(mode, state.attempt_id);
      setAttemptId(state.attempt_id);
    },
  });
  const submit = useSubmitAction();
  const requestHelp = useRequestHelp();
  const abandon = useAbandonAttempt();

  useEffect(() => {
    setAttemptId(readAttemptId(mode));
    setLoaded(true);
  }, [mode]);

  const missing = query.error instanceof ApiError && query.error.status === 404;
  const state = query.data ?? null;
  const needsNew =
    loaded && (!attemptId || missing || state?.status === "abandoned");
  const {
    mutate: createAttempt,
    isPending: creating,
    isError: createFailed,
  } = create;

  useEffect(() => {
    if (needsNew && !creating && !createFailed)
      createAttempt({ track_id: TRACK_ID, mode });
  }, [needsNew, creating, createFailed, createAttempt, mode]);

  useEffect(() => {
    setPracticeActivity(
      state?.status === "in_progress"
        ? {
            mode,
            current: state.progress.current,
            total: state.progress.total,
            engaged: engaged.current || state.progress.current > 1,
          }
        : null,
    );
  }, [state, mode]);
  useEffect(() => () => setPracticeActivity(null), []);

  function choose(optionId: string) {
    const item = state?.current_item;
    if (!state || !item || submit.isPending) return;
    engaged.current = true;
    submit.mutate(
      { attemptId: state.attempt_id, item_id: item.id, option_id: optionId },
      {
        onSuccess: (next) => {
          const feedback = next.last_feedback;
          if (!feedback) return;
          if (feedback.is_expected) {
            setAnswer({
              item,
              optionId,
              correct: true,
              message: feedback.message,
            });
            setWrongIds([]);
            setHelp(null);
          } else {
            setAnswer({
              item,
              optionId,
              correct: false,
              message: feedback.message,
            });
            setWrongIds((ids) => [...new Set([...ids, optionId])]);
          }
        },
      },
    );
  }

  function askHelp(kind: HelpKind) {
    if (!state || requestHelp.isPending) return;
    engaged.current = true;
    requestHelp.mutate(
      { attemptId: state.attempt_id, kind },
      { onSuccess: (data) => setHelp({ kind, content: data.content }) },
    );
  }

  /** Depois de um acerto, mostra o próximo item que a API já liberou. */
  function next() {
    setAnswer(null);
  }

  function restart() {
    engaged.current = false;
    setAnswer(null);
    setWrongIds([]);
    setHelp(null);
    create.reset();
    createAttempt({ track_id: TRACK_ID, mode });
  }

  async function leave() {
    if (state?.status === "in_progress")
      await abandon.mutateAsync(state.attempt_id).catch(() => undefined);
    writeAttemptId(mode, null);
    setPracticeActivity(null);
  }

  return {
    state,
    // Enquanto o acerto é exibido, a tela mantém o item respondido.
    item: answer?.correct ? answer.item : (state?.current_item ?? null),
    answer,
    wrongIds,
    help,
    loading:
      !loaded || query.isPending || creating || (needsNew && !createFailed),
    error:
      createFailed || (query.isError && !missing)
        ? (create.error ?? query.error)
        : null,
    actionError: submit.error ?? requestHelp.error,
    pending: submit.isPending,
    helpPending: requestHelp.isPending,
    choose,
    askHelp,
    next,
    restart,
    leave,
    retry: () => {
      create.reset();
      void query.refetch();
    },
  };
}
