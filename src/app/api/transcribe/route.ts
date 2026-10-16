import { handleTranscription } from "@/app/api/transcribe/_lib/handle-transcription";

export const maxDuration = 40;

export async function POST(request: Request) {
  return handleTranscription(request);
}
