/**
 * Lightbox accessibile per le gallerie della pagina progetto.
 * Sorgente: ogni <figure data-lightbox> contenente <img>. La didascalia viene
 * letta da <figcaption> o dall'attributo alt. Navigazione con frecce, chiusura
 * con Esc / click sullo sfondo, focus trap e ripristino del focus alla chiusura.
 */

interface Slide {
  src: string;
  caption: string;
}

const ARROW = {
  left: '<path d="M15 18l-6-6 6-6"/>',
  right: '<path d="M9 18l6-6-6-6"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
};

function svg(path: string): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

export function initGallery(): void {
  const figures = Array.from(
    document.querySelectorAll<HTMLElement>('figure[data-lightbox]'),
  ).filter((fig) => fig.querySelector('img'));
  if (figures.length === 0) return;

  const slides: Slide[] = figures.map((fig) => {
    const img = fig.querySelector('img') as HTMLImageElement;
    const cap = fig.querySelector('figcaption')?.textContent?.trim();
    return { src: img.currentSrc || img.src, caption: cap || img.alt || '' };
  });

  // --- Costruzione DOM del lightbox ---
  const root = document.createElement('div');
  root.className = 'lightbox';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Immagine ingrandita');
  root.innerHTML = `
    <button class="lightbox__btn lightbox__btn--close" type="button" aria-label="Chiudi">${svg(ARROW.close)}</button>
    <button class="lightbox__btn lightbox__btn--prev" type="button" aria-label="Immagine precedente">${svg(ARROW.left)}</button>
    <button class="lightbox__btn lightbox__btn--next" type="button" aria-label="Immagine successiva">${svg(ARROW.right)}</button>
    <figure class="lightbox__fig">
      <img class="lightbox__img" alt="">
      <figcaption class="lightbox__cap"></figcaption>
    </figure>`;
  document.body.appendChild(root);

  const imgEl = root.querySelector('.lightbox__img') as HTMLImageElement;
  const capEl = root.querySelector('.lightbox__cap') as HTMLElement;
  const btnClose = root.querySelector('.lightbox__btn--close') as HTMLButtonElement;
  const btnPrev = root.querySelector('.lightbox__btn--prev') as HTMLButtonElement;
  const btnNext = root.querySelector('.lightbox__btn--next') as HTMLButtonElement;
  const focusable = [btnClose, btnPrev, btnNext];

  let current = 0;
  let lastFocused: HTMLElement | null = null;

  function render(): void {
    const slide = slides[current];
    if (!slide) return;
    imgEl.src = slide.src;
    imgEl.alt = slide.caption;
    capEl.textContent = slide.caption;
    capEl.hidden = slide.caption === '';
  }

  function open(index: number): void {
    current = index;
    lastFocused = document.activeElement as HTMLElement;
    render();
    root.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
    window.addEventListener('keydown', onKey);
  }

  function close(): void {
    root.classList.remove('is-open');
    document.body.style.overflow = '';
    window.removeEventListener('keydown', onKey);
    lastFocused?.focus();
  }

  function go(step: number): void {
    current = (current + step + slides.length) % slides.length;
    render();
  }

  function onKey(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowLeft':
        go(-1);
        break;
      case 'ArrowRight':
        go(1);
        break;
      case 'Tab': {
        // focus trap
        const idx = focusable.indexOf(document.activeElement as HTMLButtonElement);
        e.preventDefault();
        const next = e.shiftKey ? idx - 1 : idx + 1;
        const target = focusable[(next + focusable.length) % focusable.length];
        target?.focus();
        break;
      }
    }
  }

  figures.forEach((fig, i) => {
    fig.setAttribute('role', 'button');
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('aria-label', `Ingrandisci: ${slides[i]?.caption || 'immagine'}`);
    fig.addEventListener('click', () => open(i));
    fig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => go(-1));
  btnNext.addEventListener('click', () => go(1));
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });
}
