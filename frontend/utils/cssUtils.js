export function classNames(...args) {
  return args
    .filter(Boolean)
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (Array.isArray(arg)) return classNames(...arg);
      if (typeof arg === 'object') {
        return Object.entries(arg)
          .filter(([, v]) => Boolean(v))
          .map(([k]) => k)
          .join(' ');
      }
      return '';
    })
    .join(' ');
}

export function styleToString(styles) {
  return Object.entries(styles)
    .map(([key, val]) => {
      const kebab = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `${kebab}: ${val}`;
    })
    .join('; ');
}

export function getResponsiveValue(width, values) {
  if (typeof values === 'string') return values;
  if (typeof values === 'object') {
    if (width < 640) return values.sm || values.base;
    if (width < 768) return values.md || values.sm || values.base;
    if (width < 1024) return values.lg || values.md || values.base;
    return values.xl || values.lg || values.base;
  }
  return values;
}
