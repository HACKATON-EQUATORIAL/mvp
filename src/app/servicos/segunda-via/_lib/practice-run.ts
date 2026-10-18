"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushEvents } from "@/http/events/post-events";
import {
  flushPendingSubmits,
  type SubmitStep,
  submitAttempt,
} from "@/http/practice/submit-attempt";
import { feedback as sfx } from "@/lib/feedback/sound";
import { setPracticeActivity } from "@/lib/practice/activity";
import type { BundleItem } from "@/schemas/http/track";
import { TRACK_ID } from "./steps";

type HelpKind = "hint" | "explanation" | "accessibility";
type Answer = {
  itemId: string;
  optionId: string;
  correct: boolean;
  message: string;
};

// Passos da etapa 2 (uma tentativa guiada com as 4 partes), acumulados entre as telas.
const PARTS_KEY = "digitaliza:segunda-via:parts-log";

function readParts(): Record<string, SubmitStep[]> {
  try {
    return JSON.parse(localStorage.getItem(PARTS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeParts(log: Record<string, SubmitStep[]>) {
  try {
    localStorage.setItem(PARTS_KEY, JSON.stringify(log));
  } catch {
    // Sem armazenamento: a etapa 2 é enviada só se feita nesta página.
  }
}

/** Ordem de exibição embaralhada (estável por item), para o certo não ficar sempre em cima. */
export function shuffled<T extends { id: string }>(
  itemId: string,
  options: T[],
) {
  const seed = [...itemId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return [...options].sort(
    (a, b) =>
      ((a.id.length * 31 + seed) % 7) - ((b.id.length * 31 + seed) % 7) ||
      a.id.localeCompare(b.id),
  );
}

/**
 * Prática local: corrige na hora com o pacote do serviço e envia tudo no fim
 * (`/practice/attempts/submit`), onde o backend refaz a correção.
 * - `part`: só os itens de uma parte (etapa 2), com feedback por opção e dica.
 * - `full`: todos os itens (etapa 3), feedback neutro e ajuda só sob pedido.
 */
export function usePracticeRun({
  items,
  allItemIds,
  kind,
}: {
  items: BundleItem[];
  /** IDs de todos os itens do serviço (ordem do conteúdo), para a etapa 2. */
  allItemIds: string[];
  kind: "part" | "full";
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [help, setHelp] = useState<{ kind: HelpKind; content: string } | null>(
    null,
  );
  const [combo, setCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [assisted, setAssisted] = useState(false);
  const [done, setDone] = useState(false);
  const steps = useRef<SubmitStep[]>([]);
  const item = items[index] ?? null;

  useEffect(() => {
    void flushPendingSubmits();
  }, []);

  useEffect(() => {
    setPracticeActivity(
      done || !item
        ? null
        : {
            mode: kind === "full" ? "independent" : "guided",
            current: index + 1,
            total: items.length,
            engaged: steps.current.length > 0,
          },
    );
  }, [done, item, index, items.length, kind]);
  useEffect(() => () => setPracticeActivity(null), []);

  const options = useMemo(
    () => (item ? shuffled(item.id, item.options) : []),
    [item],
  );

  function choose(optionId: string) {
    if (!item || answer?.correct) return;
    const option = item.options.find((entry) => entry.id === optionId);
    if (!option) return;
    steps.current.push({
      type: "action",
      item_id: item.id,
      option_id: optionId,
    });
    const message =
      option.is_expected || kind === "part"
        ? option.feedback
        : item.neutral_feedback;
    if (option.is_expected) {
      sfx.correct();
      setCombo((value) => (wrongIds.length === 0 ? value + 1 : 0));
      setHelp(null);
    } else {
      sfx.wrong();
      setCombo(0);
      setMistakes((value) => value + 1);
      setWrongIds((ids) => [...new Set([...ids, optionId])]);
    }
    setAnswer({
      itemId: item.id,
      optionId,
      correct: option.is_expected,
      message,
    });
  }

  function askHelp(helpKind: HelpKind) {
    if (!item) return;
    steps.current.push({ type: "help", item_id: item.id, kind: helpKind });
    // Mesma regra do backend: no modo sozinho, dica ou explicação que revela contam como apoio.
    if (
      kind === "full" &&
      (helpKind === "hint" ||
        (helpKind === "explanation" && item.explanation.reveals_solution))
    )
      setAssisted(true);
    setHelp({
      kind: helpKind,
      content:
        helpKind === "hint"
          ? item.hint
          : helpKind === "explanation"
            ? item.explanation.text
            : item.accessibility,
    });
  }

  function next() {
    if (!answer?.correct) return;
    setAnswer(null);
    setWrongIds([]);
    if (index + 1 < items.length) {
      setIndex(index + 1);
      return;
    }
    setDone(true);
    finish();
  }

  function finish() {
    if (kind === "full") {
      void submitAttempt({
        track_id: TRACK_ID,
        mode: "independent",
        steps: steps.current,
      });
    } else {
      // Etapa 2: guarda os passos desta parte; com as 4 partes feitas, envia tudo junto.
      const log = { ...readParts() };
      for (const entry of items) {
        log[entry.id] = steps.current.filter(
          (step) => step.item_id === entry.id,
        );
      }
      writeParts(log);
      if (allItemIds.every((id) => log[id]?.length)) {
        void submitAttempt({
          track_id: TRACK_ID,
          mode: "guided",
          steps: allItemIds.flatMap((id) => log[id]),
        });
        writeParts({});
      }
    }
    flushEvents();
  }

  function restart() {
    steps.current = [];
    setIndex(0);
    setAnswer(null);
    setWrongIds([]);
    setHelp(null);
    setCombo(0);
    setMistakes(0);
    setAssisted(false);
    setDone(false);
  }

  return {
    item,
    options,
    index,
    total: items.length,
    answer,
    wrongIds,
    help,
    combo,
    mistakes,
    assisted,
    done,
    choose,
    askHelp,
    next,
    restart,
  };
}
