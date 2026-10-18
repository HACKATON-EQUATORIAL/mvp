export const getAttemptKeys = {
  all: ["practice", "attempts"] as const,
  byId: (attemptId: string) => ["practice", "attempts", attemptId] as const,
};
