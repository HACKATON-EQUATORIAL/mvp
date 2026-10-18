import { handleInterpretation } from "./_lib/handle-interpretation";

export const maxDuration = 35;
export async function POST(request: Request) {
  return handleInterpretation(request);
}
