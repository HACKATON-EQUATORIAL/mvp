import { z } from "zod";

export const channelExitSchema = z.object({
  url: z.url().nullable(),
  is_simulated: z.boolean(),
  label: z.string(),
  requirements_notice: z.string(),
  // Destinos oficiais com link configurado no backend.
  destinations: z
    .array(
      z.object({
        id: z.string(),
        kind: z.enum(["web", "whatsapp", "app"]),
        label: z.string(),
        description: z.string(),
        region: z.string().nullable(),
        url: z.url(),
      }),
    )
    .default([]),
});
export type ChannelExit = z.infer<typeof channelExitSchema>;
