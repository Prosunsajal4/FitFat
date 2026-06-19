export function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function unique(arr, key) {
  if (!key) return [...new Set(arr)];
  const seen = new Set();
  return arr.filter((item) => {
    const k = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const k = typeof key === 'function' ? key(item) : item[key];
    (groups[k] = groups[k] || []).push(item);
    return groups;
  }, {});
}

export function sortBy(arr, key, order = 'asc') {
  return [...arr].sort((a, b) => {
    const va = typeof key === 'function' ? key(a) : a[key];
    const vb = typeof key === 'function' ? key(b) : b[key];
    if (va < vb) return order === 'asc' ? -1 : 1;
    if (va > vb) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function flatten(arr) {
  return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
}

export function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
}

export function omit(obj, keys) {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key)) acc[key] = obj[key];
    return acc;
  }, {});
}
