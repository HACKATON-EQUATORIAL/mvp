import { z } from "zod";

export const channelExitSchema = z.object({
  url: z.url().nullable(),
  is_simulated: z.boolean(),
  label: z.string(),
  requirements_notice: z.string(),
});
export type ChannelExit = z.infer<typeof channelExitSchema>;
