// Mobile menu toggle. Keeps aria-expanded in sync (CSS shows/hides the list from it),
// closes on Escape and returns focus to the button, as keyboard users expect.

const button = document.querySelector<HTMLButtonElement>('.menu-toggle');

if (button) {
  const setOpen = (open: boolean) => button.setAttribute('aria-expanded', String(open));

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
}
