/**
 * Logs to console (for now) when a request comes in, and when a response is finished.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requestLogger(req, res, next) {
  const start = Date.now();

  console.log(`--> ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    console.log(
      `<-- ${req.method} ${req.originalUrl} ${res.statusCode} (${Date.now() - start}ms)`,
    );
  });

  next();
}
