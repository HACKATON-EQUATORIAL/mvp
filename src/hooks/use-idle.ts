"use client";

import { useEffect, useState } from "react";

const EVENTS = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"];

/**
 * Fica `true` depois de `ms` sem toque, tecla ou rolagem; volta a `false` na
 * próxima interação. `key` reinicia a contagem (ex.: ao trocar de tela).
 */
export function useIdle(ms: number, key?: string) {
  const [idle, setIdle] = useState(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` reinicia a contagem
  useEffect(() => {
    let timer = setTimeout(() => setIdle(true), ms);
    const reset = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), ms);
    };
    setIdle(false);
    for (const event of EVENTS)
      window.addEventListener(event, reset, { capture: true, passive: true });
    return () => {
      clearTimeout(timer);
      for (const event of EVENTS)
        window.removeEventListener(event, reset, { capture: true });
    };
  }, [ms, key]);
  return idle;
}
