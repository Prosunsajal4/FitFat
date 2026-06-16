const validateObjectId = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  if (id && !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `Invalid ${paramName} format` });
  }
  next();
};

const validateBody = (schema) => (req, res, next) => {
  const errors = [];
  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
    }
    if (value !== undefined && value !== null && rules.type) {
      if (rules.type === 'number' && isNaN(Number(value))) {
        errors.push(`${field} must be a number`);
      }
    }
    if (value !== undefined && rules.min !== undefined && Number(value) < rules.min) {
      errors.push(`${field} must be at least ${rules.min}`);
    }
    if (value !== undefined && rules.max !== undefined && Number(value) > rules.max) {
      errors.push(`${field} must be at most ${rules.max}`);
    }
  }
  if (errors.length) return res.status(400).json({ message: errors.join(', ') });
  next();
};

module.exports = { validateObjectId, validateBody };
