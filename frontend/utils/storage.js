export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('storage setItem error:', e);
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('storage removeItem error:', e);
  }
}
