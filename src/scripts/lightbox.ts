// Photo viewer. Links marked data-lightbox open their image in a <dialog> over the page
// instead of leaving it. Links sharing a data-lightbox value form a set you can step through
// with the buttons, the arrow keys, or a swipe. Without JavaScript the links still open the
// large image directly. Styles are in global.css (scoped styles don't reach DOM built here).
//
// <dialog> + showModal() gives us the dimmed backdrop, a focus trap and Escape-to-close for free.

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text = '') {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

const dialog = el('dialog', 'lightbox');
dialog.setAttribute('aria-label', 'Photo viewer');

const closeButton = el('button', 'lightbox__button lightbox__close', 'Close ✕');
const figure = el('figure', 'lightbox__figure');
const image = el('img', 'lightbox__img');
const caption = el('figcaption', 'lightbox__caption');
caption.setAttribute('aria-live', 'polite'); // screen readers hear each new photo's caption
const bar = el('div', 'lightbox__bar');
const prevButton = el('button', 'lightbox__button', '‹ Previous');
const counter = el('span', 'lightbox__count');
const nextButton = el('button', 'lightbox__button', 'Next ›');

for (const b of [closeButton, prevButton, nextButton]) b.type = 'button';
bar.append(prevButton, counter, nextButton);
figure.append(image, caption);
dialog.append(closeButton, figure, bar);
document.body.append(dialog);

let set: HTMLAnchorElement[] = [];
let index = 0;

function show(i: number) {
  index = (i + set.length) % set.length; // wrap around at either end
  const link = set[index]!;
  const thumb = link.querySelector('img');
  image.src = link.href;
  image.alt = thumb?.alt ?? '';
  caption.textContent = link.dataset.caption ?? thumb?.alt ?? '';
  counter.textContent = `${index + 1} of ${set.length}`;
  // Start loading the neighbours so stepping through feels instant.
  for (const n of [index - 1, index + 1]) {
    const neighbour = set[(n + set.length) % set.length];
    if (neighbour) new Image().src = neighbour.href;
  }
}

document.addEventListener('click', (event) => {
  // Let Ctrl/Cmd/middle-click open the photo in a new tab as usual.
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
    return;
  }
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-lightbox]');
  if (!link) return;
  event.preventDefault();
  set = [
    ...document.querySelectorAll<HTMLAnchorElement>(
      `a[data-lightbox="${CSS.escape(link.dataset.lightbox ?? '')}"]`,
    ),
  ];
  bar.hidden = set.length < 2;
  show(set.indexOf(link));
  dialog.showModal();
});

prevButton.addEventListener('click', () => show(index - 1));
nextButton.addEventListener('click', () => show(index + 1));
closeButton.addEventListener('click', () => dialog.close());

// A click on the dimmed area (the dialog itself, not the photo or buttons) closes it.
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener('keydown', (event) => {
  if (bar.hidden) return;
  if (event.key === 'ArrowLeft') show(index - 1);
  else if (event.key === 'ArrowRight') show(index + 1);
});

// Swipe left/right on phones.
let swipeStart: number | null = null;
image.addEventListener('pointerdown', (event) => {
  swipeStart = event.clientX;
});
image.addEventListener('pointerup', (event) => {
  if (swipeStart === null || bar.hidden) return;
  const dx = event.clientX - swipeStart;
  swipeStart = null;
  if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
});

// Return focus to the photo now showing, so keyboard users land where they left off.
dialog.addEventListener('close', () => {
  set[index]?.focus();
  image.removeAttribute('src');
});
