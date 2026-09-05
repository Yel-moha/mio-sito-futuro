/**
 * Scroll morbido per i link ad ancora interni, con offset per la navbar sticky.
 * Porting di frontend/src/js/script.js con gestione focus per l'accessibilita'.
 */
export function initSmoothScroll(): void {
  const nav = document.querySelector<HTMLElement>('.nav');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector<HTMLElement>(targetId);
      if (!target) return;

      event.preventDefault();
      const offset = (nav?.offsetHeight ?? 0) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', targetId);

      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}
