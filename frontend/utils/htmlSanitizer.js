export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return sanitizeString(String(obj));
  const clean = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') clean[key] = sanitizeString(val);
    else if (Array.isArray(val)) clean[key] = val.map((v) => (typeof v === 'string' ? sanitizeString(v) : v));
    else clean[key] = val;
  }
  return clean;
}

export function stripHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}
