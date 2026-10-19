/**
 * Voz do Eletriquinho em tempo real pelo ElevenLabs (`/api/tts`). Desligada por
 * padrão: só com `NEXT_PUBLIC_TTS_ELEVENLABS=on`. Desligada, nenhum pedido sai
 * para o serviço; as falas fixas pré-geradas (`public/voz`) continuam tocando e
 * o resto fica só no texto (sem a voz do navegador, para o timbre não divergir).
 */
export const elevenLabsTtsEnabled =
  process.env.NEXT_PUBLIC_TTS_ELEVENLABS === "on";
