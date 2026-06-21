export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export function ifClass(condition, className) {
  return condition ? className : '';
}

export function mergeClasses(...classes) {
  return classes
    .flat()
    .filter((c) => typeof c === 'string' && c.trim())
    .join(' ');
}

export function toggleClass(el, className, force) {
  if (el) el.classList.toggle(className, force);
}
