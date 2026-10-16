const RECORDING_FORMATS = [
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/webm",
  "audio/ogg;codecs=opus",
];

// Invocado somente por ação explícita no client, nunca durante a renderização.
export function getRecordingMimeType() {
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia)
    throw new Error("Para gravar, abra esta página em HTTPS ou localhost.");
  if (typeof MediaRecorder === "undefined")
    throw new Error(
      "Este navegador não permite gravar áudio. Tente outro navegador.",
    );
  const mimeType = RECORDING_FORMATS.find((type) =>
    MediaRecorder.isTypeSupported(type),
  );
  if (!mimeType)
    throw new Error(
      "Este navegador não oferece um formato de áudio compatível.",
    );
  return mimeType;
}

export function getRecordingError(cause: unknown) {
  if (cause instanceof DOMException) {
    switch (cause.name) {
      case "NotAllowedError":
        return "O microfone não foi autorizado. Permita o acesso no navegador e tente novamente.";
      case "NotFoundError":
        return "Nenhum microfone foi encontrado neste dispositivo.";
      default:
        return "Não foi possível usar o microfone. Confira se ele está disponível.";
    }
  }
  return cause instanceof Error
    ? cause.message
    : "Não foi possível iniciar a gravação.";
}
