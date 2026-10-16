import { z } from "zod";
import { AUDIO_MIME_TYPES, MAX_AUDIO_BYTES } from "@/lib/stt/constants";

export const audioFileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "A gravação está vazia.")
  .refine(
    (file) => file.size <= MAX_AUDIO_BYTES,
    "A gravação deve ter no máximo 4 MB.",
  )
  .refine(
    (file) =>
      AUDIO_MIME_TYPES.some(
        (mime) => mime === file.type.split(";")[0].trim().toLowerCase(),
      ),
    "O formato da gravação não é aceito.",
  );

export const transcriptionResponseSchema = z.object({
  text: z.string().trim().min(1),
});

export const transcriptionErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});

export type Transcription = z.infer<typeof transcriptionResponseSchema>;
