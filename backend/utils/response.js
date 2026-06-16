const formatResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data,
});

const formatPaginated = (data, page, limit, total) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  },
});

const formatError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.status = statusCode;
  return err;
};

module.exports = { formatResponse, formatPaginated, formatError };
