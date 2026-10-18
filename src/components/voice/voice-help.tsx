"use client";

import { useEffect } from "react";
import { useVoicePage } from "./voice-assistant-provider";
import type { VoicePageContext } from "./voice-page-context";

// Pages publish serializable context; the persistent shell owns the assistant.
export function VoiceHelp({ context }: { context: VoicePageContext }) {
  const { register } = useVoicePage();
  useEffect(() => register(context), [context, register]);
  return null;
}
