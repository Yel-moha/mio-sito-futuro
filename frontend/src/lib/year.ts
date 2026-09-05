/** Inserisce l'anno corrente in ogni elemento con [data-current-year]. */
export function setCurrentYear(): void {
  const year = String(new Date().getFullYear());
  document.querySelectorAll<HTMLElement>('[data-current-year]').forEach((el) => {
    el.textContent = year;
  });
}
