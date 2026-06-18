export function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const storageKey = `rl_${key}`;
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || '{"attempts":[]}');
    const recent = data.attempts.filter((t) => now - t < windowMs);
    if (recent.length >= maxAttempts) {
      const oldest = recent[0];
      const waitMs = windowMs - (now - oldest);
      return { allowed: false, remaining: 0, retryAfter: Math.ceil(waitMs / 1000) };
    }
    recent.push(now);
    localStorage.setItem(storageKey, JSON.stringify({ attempts: recent }));
    return { allowed: true, remaining: maxAttempts - recent.length, retryAfter: 0 };
  } catch {
    return { allowed: true, remaining: maxAttempts, retryAfter: 0 };
  }
}

export function resetRateLimit(key) {
  try { localStorage.removeItem(`rl_${key}`); } catch {}
}
