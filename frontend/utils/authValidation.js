export function validateRegister(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Valid email is required';
  }
  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateLogin(data) {
  const errors = {};
  if (!data.email) errors.email = 'Email is required';
  if (!data.password) errors.password = 'Password is required';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateProfile(data) {
  const errors = {};
  if (data.name && data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (data.weight && (isNaN(data.weight) || data.weight <= 0 || data.weight > 500)) {
    errors.weight = 'Invalid weight';
  }
  if (data.height && (isNaN(data.height) || data.height <= 0 || data.height > 300)) {
    errors.height = 'Invalid height';
  }
  if (data.age && (isNaN(data.age) || data.age < 10 || data.age > 120)) {
    errors.age = 'Invalid age';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
