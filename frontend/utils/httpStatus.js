export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY: 429,
  SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission.',
  NOT_FOUND: 'Resource not found.',
  SERVER: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
  VALIDATION: 'Please check your input.',
};
