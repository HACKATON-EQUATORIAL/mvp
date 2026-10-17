import { z } from "zod";

const apiUrlSchema = z.url().refine((value) => {
  const url = new URL(value);
  return (
    ["http:", "https:"].includes(url.protocol) &&
    !url.search &&
    !url.hash &&
    !url.username &&
    !url.password
  );
});

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

function pickApiUrl() {
  const tunnelUrl = process.env.NEXT_PUBLIC_API_TUNNEL_URL;
  // Aberto por um host que não é local (ngrok), localhost apontaria para o
  // aparelho; usa o túnel do backend quando configurado.
  if (
    tunnelUrl &&
    typeof window !== "undefined" &&
    !LOCAL_HOSTS.has(window.location.hostname)
  )
    return tunnelUrl;
  return process.env.NEXT_PUBLIC_API_URL;
}

export function getApiUrl() {
  const result = apiUrlSchema.safeParse(pickApiUrl());
  if (!result.success)
    throw new Error(
      "Endereço da API não configurado. Confira NEXT_PUBLIC_API_URL.",
    );
  return `${result.data.replace(/\/+$/, "")}/`;
}
