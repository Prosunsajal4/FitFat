const paginate = (query, page = 1, limit = 20) => {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (safePage - 1) * safeLimit;
  return { skip, limit: safeLimit, page: safePage };
};

const sort = (sortBy = 'createdAt', order = 'desc') => {
  const allowed = ['createdAt', 'updatedAt', 'name', 'date', 'weight'];
  const field = allowed.includes(sortBy) ? sortBy : 'createdAt';
  const dir = order === 'asc' ? 1 : -1;
  return { [field]: dir };
};

module.exports = { paginate, sort };
