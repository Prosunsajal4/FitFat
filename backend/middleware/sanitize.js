const sanitize = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return sanitize(obj);
  const clean = {};
  for (const [key, val] of Object.entries(obj)) {
    clean[key] = Array.isArray(val)
      ? val.map(sanitizeObject)
      : typeof val === 'string'
      ? sanitize(val)
      : val;
  }
  return clean;
};

const sanitizeInput = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

module.exports = { sanitize, sanitizeObject, sanitizeInput };
