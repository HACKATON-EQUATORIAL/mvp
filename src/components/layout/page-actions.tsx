"use client";

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { JOURNEY_ACTIONS_ID } from "./journey-page";
import { findVisibleById } from "./journey-target";

/** Envia botões de um componente de cliente para a barra fixa da tela. */
export function PageActions({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setTarget(findVisibleById(JOURNEY_ACTIONS_ID));
  }, []);
  return target ? createPortal(children, target) : null;
}
