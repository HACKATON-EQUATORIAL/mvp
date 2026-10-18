/** Volta o miolo rolável da tela ao topo (ex.: nova pergunta ou novo passo). */
export function scrollJourneyToTop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .querySelector("[data-journey-scroll]")
    ?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

/** Mostra um elemento dentro do miolo sem saltos bruscos. */
export function revealInJourney(element: HTMLElement | null) {
  if (!element) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.focus({ preventScroll: true });
  element.scrollIntoView({
    block: "nearest",
    behavior: reduced ? "auto" : "smooth",
  });
}
