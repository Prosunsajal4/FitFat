const passwordRules = {
  minLength: (val) => val && val.length >= 8,
  hasUpperCase: (val) => /[A-Z]/.test(val),
  hasLowerCase: (val) => /[a-z]/.test(val),
  hasNumber: (val) => /[0-9]/.test(val),
  hasSpecial: (val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val),
};

function validatePassword(password) {
  const errors = [];
  if (!passwordRules.minLength(password)) errors.push('At least 8 characters');
  if (!passwordRules.hasUpperCase(password)) errors.push('One uppercase letter');
  if (!passwordRules.hasLowerCase(password)) errors.push('One lowercase letter');
  if (!passwordRules.hasNumber(password)) errors.push('One number');
  if (!passwordRules.hasSpecial(password)) errors.push('One special character');
  return { valid: errors.length === 0, errors, strength: 5 - errors.length };
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateName(name) {
  return typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 50;
}

function validateWeight(weight) {
  const w = parseFloat(weight);
  return !isNaN(w) && w > 0 && w < 500;
}

function validateHeight(height) {
  const h = parseFloat(height);
  return !isNaN(h) && h > 50 && h < 300;
}

module.exports = { validatePassword, validateEmail, validateName, validateWeight, validateHeight };
