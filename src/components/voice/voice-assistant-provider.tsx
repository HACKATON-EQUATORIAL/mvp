"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { VoicePageContext } from "./voice-page-context";

const VoiceContext = createContext<{
  context: VoicePageContext | null;
  register: (context: VoicePageContext) => () => void;
} | null>(null);

export function VoiceAssistantProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<VoicePageContext | null>(null);
  const owner = useRef<symbol | null>(null);
  const register = useCallback((next: VoicePageContext) => {
    const token = Symbol("page-voice-context");
    owner.current = token;
    setContext((current) =>
      JSON.stringify(current) === JSON.stringify(next) ? current : next,
    );
    return () => {
      if (owner.current !== token) return;
      owner.current = null;
      setContext(null);
    };
  }, []);
  const value = useMemo(() => ({ context, register }), [context, register]);
  return (
    <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
  );
}

export function useVoicePage() {
  const value = useContext(VoiceContext);
  if (!value) throw new Error("VoiceAssistantProvider ausente.");
  return value;
}
