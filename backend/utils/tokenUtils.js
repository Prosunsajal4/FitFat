const crypto = require('crypto');

function generateToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return '***';
  const [user, domain] = email.split('@');
  const masked = user.length > 2 ? user[0] + '***' + user[user.length - 1] : '***';
  return `${masked}@${domain}`;
}

module.exports = { generateToken, hashToken, maskEmail };
