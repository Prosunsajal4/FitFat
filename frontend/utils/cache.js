const cache = new Map();

export function memoize(key, fn, ttlMs = 300000) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < ttlMs) return cached.value;
  const value = fn();
  cache.set(key, { value, time: Date.now() });
  return value;
}

export async function memoizeAsync(key, fn, ttlMs = 300000) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < ttlMs) return cached.value;
  const value = await fn();
  cache.set(key, { value, time: Date.now() });
  return value;
}

export function clearCache(key) {
  if (key) cache.delete(key);
  else cache.clear();
}

export function getCacheSize() {
  return cache.size;
}
