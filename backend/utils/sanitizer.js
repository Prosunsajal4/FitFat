const sanitizeHtml = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const sanitizeInput = (input) => {
  if (typeof input === 'string') return sanitizeHtml(input.trim());
  if (Array.isArray(input)) return input.map(sanitizeInput);
  if (input && typeof input === 'object') {
    const clean = {};
    for (const [key, val] of Object.entries(input)) {
      if (typeof val === 'string') clean[key] = sanitizeHtml(val.trim());
      else if (Array.isArray(val)) clean[key] = val.map(sanitizeInput);
      else if (val && typeof val === 'object') clean[key] = sanitizeInput(val);
      else clean[key] = val;
    }
    return clean;
  }
  return input;
};

module.exports = { sanitizeHtml, sanitizeInput };
