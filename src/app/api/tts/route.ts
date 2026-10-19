import { handleTts } from "@/app/api/tts/_lib/handle-tts";

export const maxDuration = 20;

export async function GET(request: Request) {
  return handleTts(request);
}
