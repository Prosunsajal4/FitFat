const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const isValidDate = (dateStr) => {
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d.getTime());
};

const isNonEmptyString = (val) => typeof val === 'string' && val.trim().length > 0;

const isPositiveInt = (val) => Number.isInteger(Number(val)) && Number(val) > 0;

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidURL = (url) => {
  try { new URL(url); return true; } catch { return false; }
};

module.exports = { isValidObjectId, isValidDate, isNonEmptyString, isPositiveInt, isValidEmail, isValidURL };
