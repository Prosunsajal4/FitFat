export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function shallowEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => a[key] === b[key]);
}

export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(deepClone);
  const clone = {};
  for (const key of Object.keys(obj)) clone[key] = deepClone(obj[key]);
  return clone;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function truncate(str, maxLen = 100) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}
