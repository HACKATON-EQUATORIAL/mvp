export type VoicePageSuggestion = {
  id: string;
  label: string;
  confirmation: string;
  href: string;
};

export type VoicePageContext = {
  id: string;
  description: string;
  suggestions: VoicePageSuggestion[];
  /** Dica curta da tela, dita pelo Eletriquinho no balão do canto. */
  tip?: string;
};
