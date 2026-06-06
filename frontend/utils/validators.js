export function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isNumber(val) {
  return !isNaN(parseFloat(val)) && isFinite(val);
}

export function isPositiveNumber(val) {
  return isNumber(val) && parseFloat(val) > 0;
}

export function isInRange(val, min, max) {
  const num = parseFloat(val);
  return isNumber(val) && num >= min && num <= max;
}

export function minLength(val, min) {
  return typeof val === 'string' && val.length >= min;
}

export function maxLength(val, max) {
  return typeof val === 'string' && val.length <= max;
}

export function required(val) {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  return true;
}

export function validateForm(rules) {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      if (rule.condition === false) {
        errors[field] = rule.message;
        break;
      }
    }
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function formatWeight(val) {
  return isNumber(val) ? parseFloat(val).toFixed(1) : '0.0';
}

export function formatNumber(val, decimals = 0) {
  return isNumber(val) ? parseFloat(val).toFixed(decimals) : '0';
}