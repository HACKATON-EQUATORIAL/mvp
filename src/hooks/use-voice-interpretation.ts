"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { requestInterpretation } from "@/lib/assistant/interpret-client";
import type {
  InterpretationRequest,
  InterpretationResult,
} from "@/lib/assistant/schemas";

export type VoiceInterpretationState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; result: InterpretationResult }
  | { status: "error"; message: string };

export function useVoiceInterpretation() {
  const [state, setState] = useState<VoiceInterpretationState>({
    status: "idle",
  });
  const active = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const invalidate = useCallback(() => {
    generation.current += 1;
    active.current?.abort();
    active.current = null;
  }, []);
  useEffect(() => () => invalidate(), [invalidate]);

  const cancel = useCallback(() => {
    invalidate();
    setState((current) =>
      current.status === "pending" ? { status: "idle" } : current,
    );
  }, [invalidate]);
  const reset = useCallback(() => {
    invalidate();
    setState({ status: "idle" });
  }, [invalidate]);

  async function interpret(input: InterpretationRequest) {
    if (active.current) return;
    const token = ++generation.current;
    const controller = new AbortController();
    active.current = controller;
    setState({ status: "pending" });
    try {
      const result = await requestInterpretation(input, controller.signal);
      if (generation.current === token) {
        setState({ status: "success", result });
        return result;
      }
    } catch (cause) {
      if (generation.current !== token) return;
      setState({
        status: "error",
        message:
          cause instanceof Error
            ? cause.message
            : "Não consegui interpretar seu pedido. Tente novamente.",
      });
    } finally {
      if (generation.current === token) active.current = null;
    }
  }
  return { state, interpret, cancel, reset };
}
