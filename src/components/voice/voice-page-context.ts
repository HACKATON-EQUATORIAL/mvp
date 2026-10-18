export type VoicePageSuggestion = {
  id: string;
  label: string;
  confirmation: string;
  href: string;
};

export type VoiceScreen = {
  stage:
    | "servicos"
    | "canal"
    | "mapa"
    | "etapa1"
    | "etapa2"
    | "etapa3"
    | "conclusao"
    | "outra";
  /** Parte atual da etapa 2. */
  part?: string;
  /** O que esta tela ensina ou permite, em linguagem simples (contexto da LLM). */
  teaches: string;
};

export type VoicePageContext = {
  id: string;
  description: string;
  suggestions: VoicePageSuggestion[];
  /** Dica curta da tela, dita pelo Eletriquinho no balão do canto. */
  tip?: string;
  screen?: VoiceScreen;
};
