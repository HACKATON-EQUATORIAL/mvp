/**
 * IA do assistente (Groq: interpretação por LLM e transcrição de voz). Desligada
 * por padrão: o site hospedado só usa a Groq quando `NEXT_PUBLIC_ASSISTANT_AI=on`.
 * Sem ela, o assistente segue com chips e ajuda local da tela e da lição.
 */
export const assistantAiEnabled = process.env.NEXT_PUBLIC_ASSISTANT_AI === "on";
