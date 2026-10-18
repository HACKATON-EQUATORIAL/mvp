// Rolagem só dentro do miolo da tela visível. Nunca usar `scrollIntoView`: ele
// rola também os ancestrais travados (shell), tirando o header da tela.

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Miolo rolável da tela visível (telas anteriores podem seguir montadas e ocultas). */
function journeyScroll() {
  return (
    [...document.querySelectorAll<HTMLElement>("[data-journey-scroll]")].find(
      (element) => element.checkVisibility(),
    ) ?? null
  );
}

/** Volta o miolo rolável da tela ao topo (ex.: nova pergunta ou conclusão). */
export function scrollJourneyToTop() {
  journeyScroll()?.scrollTo({
    top: 0,
    behavior: reducedMotion() ? "auto" : "smooth",
  });
}

/** Mostra um elemento dentro do miolo, rolando só o miolo. */
export function revealInJourney(
  element: HTMLElement | null,
  focus = true,
  /** Espaço livre abaixo do elemento (ex.: para o Eletriquinho não cobrir). */
  bottomGap = 0,
  behavior?: ScrollBehavior,
) {
  const container = element && journeyScroll();
  if (!element || !container) return;
  if (focus) element.focus({ preventScroll: true });
  const box = element.getBoundingClientRect();
  const rect = container.getBoundingClientRect();
  const bottom = rect.bottom - bottomGap;
  if (box.top >= rect.top && box.bottom <= bottom) return;
  container.scrollTo({
    top:
      container.scrollTop +
      (box.bottom > bottom ? box.bottom - bottom : box.top - rect.top),
    behavior: behavior ?? (reducedMotion() ? "auto" : "smooth"),
  });
}
