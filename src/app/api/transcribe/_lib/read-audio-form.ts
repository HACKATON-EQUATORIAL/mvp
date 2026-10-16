import "server-only";
import { MAX_AUDIO_BYTES } from "@/lib/stt/constants";
import { TranscriptionError } from "@/server/stt/transcription-error";

// Limita o corpo antes de montar o FormData, inclusive em uploads sem Content-Length.
export async function readAudioForm(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_AUDIO_BYTES + 65_536) {
        await reader.cancel();
        throw new TranscriptionError(
          "AUDIO_TOO_LARGE",
          "A gravação deve ter no máximo 4 MB.",
          413,
        );
      }
      chunks.push(new Uint8Array(value));
    }
  } finally {
    reader.releaseLock();
  }
  return new Response(new Blob(chunks), {
    headers: { "Content-Type": request.headers.get("content-type") ?? "" },
  }).formData();
}
