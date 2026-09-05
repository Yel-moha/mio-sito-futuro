/** Reveal-on-scroll: aggiunge .is-visible agli elementi .reveal quando entrano nel viewport. */
export function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');
  if (items.length === 0) return;

  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const siblings = Array.from(el.parentElement?.querySelectorAll(':scope > .reveal') ?? []);
        const index = Math.max(0, siblings.indexOf(el));
        el.style.setProperty('--reveal-delay', `${Math.min(index, 6) * 70}ms`);
        el.classList.add('is-visible');
        obs.unobserve(el);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -4% 0px' },
  );

  items.forEach((el) => observer.observe(el));

  // Rete di sicurezza: se per qualche motivo l'observer non scatta, mostra tutto.
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      items.forEach((el) => el.classList.add('is-visible'));
    }, 1500);
  });
}
