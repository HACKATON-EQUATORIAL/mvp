export const getChannelExitKeys = {
  all: ["channel-exit"] as const,
  byTrackId: (trackId?: string) => ["channel-exit", trackId ?? null] as const,
};
