const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    if (process.env.NODE_ENV !== 'production' || status >= 400) {
      console.log(`${method} ${url} ${status} ${duration}ms`);
    }
  });

  next();
};

module.exports = requestLogger;
