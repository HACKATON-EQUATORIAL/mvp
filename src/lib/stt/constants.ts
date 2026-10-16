export const MAX_AUDIO_BYTES = 4_000_000;
export const MAX_RECORDING_SECONDS = 60;

export const AUDIO_MIME_TYPES = [
  "audio/webm",
  "video/webm",
  "audio/mp4",
  "video/mp4",
  "audio/mpeg",
  "audio/mp3",
  "audio/mpga",
  "audio/m4a",
  "audio/x-m4a",
  "audio/wav",
  "audio/x-wav",
  "audio/flac",
  "audio/x-flac",
  "audio/ogg",
  "application/ogg",
] as const;

export const TRANSCRIBE_PATH = "/api/transcribe";
export const CLIENT_HEADER = "X-Digitaliza-Client";
export const CLIENT_HEADER_VALUE = "web";
export const TRANSCRIPTION_TIMEOUT_MS = 40_000;
export const PROVIDER_TIMEOUT_MS = 30_000;
