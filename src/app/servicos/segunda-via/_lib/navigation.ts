export const base = "/servicos/segunda-via";

// Jornada única: serviço → canal → WhatsApp (3 etapas) → canal oficial.
export const routes = {
  inicio: "/",
  canal: base,
  whatsapp: `${base}/whatsapp`,
  demonstracao: `${base}/whatsapp/demonstracao`,
  licoes: `${base}/whatsapp/licoes`,
  simulacao: `${base}/whatsapp/simulacao`,
} as const;
