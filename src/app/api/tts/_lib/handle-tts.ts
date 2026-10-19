import "server-only";
import { elevenLabsTtsEnabled } from "@/config/tts";
import {
  TTS_TEXT_PARAM,
  TTS_WARM_PARAM,
  ttsRequestSchema,
} from "@/lib/tts/constants";
import { getElevenLabsEnv } from "@/server/env";
import { synthesizeSpeech, warmConnection } from "@/server/tts/elevenlabs";
import { TtsError } from "@/server/tts/tts-error";

function failure(
  code: string,
  message: string,
  status: number,
  retryAfter?: string,
) {
  return Response.json(
    { error: { code, message } },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(retryAfter ? { "Retry-After": retryAfter } : {}),
      },
    },
  );
}

/**
 * `GET /api/tts?t=<texto>`: o `<audio>` toca a URL direto, em stream (um POST
 * esperaria o arquivo inteiro). O `<audio>` não envia headers próprios; só
 * pedidos da mesma origem (ou sem Sec-Fetch, como navegadores antigos) passam.
 */
export async function handleTts(request: Request) {
  if (!elevenLabsTtsEnabled)
    return failure(
      "TTS_DISABLED",
      "A voz do ElevenLabs está desligada neste ambiente.",
      503,
    );
  const site = request.headers.get("sec-fetch-site");
  if (site === "cross-site" || site === "same-site")
    return failure("FORBIDDEN_REQUEST", "Peça a fala pela página do app.", 403);

  const env = getElevenLabsEnv();
  if (!env.success)
    return failure(
      "CONFIGURATION_ERROR",
      "A voz ainda não foi configurada neste ambiente.",
      503,
    );

  const params = new URL(request.url).searchParams;
  // `?warm=1`: só abre a conexão com o provedor (resposta da LLM a caminho).
  if (params.has(TTS_WARM_PARAM)) {
    warmConnection();
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  }
  const input = ttsRequestSchema.safeParse({
    text: params.get(TTS_TEXT_PARAM) ?? "",
  });
  if (!input.success)
    return failure("INVALID_REQUEST", "Texto vazio ou longo demais.", 400);

  try {
    const { audio, cached } = await synthesizeSpeech(input.data.text, env.data);
    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        // Mesma fala de novo: o navegador reaproveita sem nova requisição.
        "Cache-Control": "private, max-age=86400",
        "X-TTS-Cache": cached ? "hit" : "miss",
      },
    });
  } catch (error) {
    if (error instanceof TtsError)
      return failure(error.code, error.message, error.status, error.retryAfter);
    return failure("TTS_FAILED", "Não foi possível gerar a fala.", 502);
  }
}
