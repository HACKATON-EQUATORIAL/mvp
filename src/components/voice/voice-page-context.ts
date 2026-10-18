import type { NavigationContext } from "@/app/servicos/segunda-via/_lib/navigation";
export type VoicePageSuggestion = {
  id: string;
  label: string;
  confirmation: string;
  href: string;
};

export type VoicePageContext = {
  id: string;
  description: string;
  navigation?: NavigationContext;
  suggestions: VoicePageSuggestion[];
};
