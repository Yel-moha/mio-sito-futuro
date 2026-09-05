/**
 * Navbar: toggle del menu mobile, stato "scrolled", evidenziazione della sezione attiva
 * tramite IntersectionObserver sugli <section id>.
 */
export function initNav(): void {
  const nav = document.querySelector<HTMLElement>('.nav');
  const toggle = document.querySelector<HTMLButtonElement>('.nav__toggle');
  const links = document.querySelector<HTMLElement>('.nav__links');
  if (!nav) return;

  // Stato "scrolled"
  const onScroll = (): void => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  if (toggle && links) {
    const setOpen = (open: boolean): void => {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    const mq = window.matchMedia('(min-width: 821px)');
    mq.addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }

  // Sezione attiva
  const anchorLinks = Array.from(
    nav.querySelectorAll<HTMLAnchorElement>('.nav__links a[href^="#"]'),
  );
  const sections = anchorLinks
    .map((a) => document.querySelector<HTMLElement>(a.getAttribute('href') ?? ''))
    .filter((el): el is HTMLElement => el !== null);

  if (sections.length > 0 && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          anchorLinks.forEach((a) =>
            a.classList.toggle('is-active', a.getAttribute('href') === id),
          );
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => spy.observe(s));
  }
}
