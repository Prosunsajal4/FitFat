export function announceToScreenReader(message, priority = 'polite') {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', priority);
  el.setAttribute('aria-atomic', 'true');
  el.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

export function getAriaLabel(text, suffix) {
  return suffix ? `${text}, ${suffix}` : text;
}

export function keyboardNavigate(event, items, currentIndex, setIndex) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    event.preventDefault();
    setIndex((currentIndex + 1) % items.length);
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    event.preventDefault();
    setIndex((currentIndex - 1 + items.length) % items.length);
  } else if (event.key === 'Home') {
    event.preventDefault();
    setIndex(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    setIndex(items.length - 1);
  }
}
