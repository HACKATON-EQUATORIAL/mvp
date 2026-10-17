import { getTrackKeys } from "./get-track";

export const getDifficultiesKeys = {
  byTrackId: (trackId: string) =>
    [...getTrackKeys.byId(trackId), "difficulties"] as const,
};
