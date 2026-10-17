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

export function getApiUrl() {
  const result = apiUrlSchema.safeParse(process.env.NEXT_PUBLIC_API_URL);
  if (!result.success)
    throw new Error(
      "Endereço da API não configurado. Confira NEXT_PUBLIC_API_URL.",
    );
  return `${result.data.replace(/\/+$/, "")}/`;
}
