/**
 * Elemento da tela visível com este ID. O Next pode manter telas anteriores
 * montadas e ocultas, então pode haver mais de um `#journey-actions` no DOM.
 */
export function findVisibleById(id: string) {
  const all = [...document.querySelectorAll<HTMLElement>(`[id="${id}"]`)];
  return (
    all.find((element) => element.closest("main")?.checkVisibility() ?? true) ??
    all[0] ??
    null
  );
}
