export default class AppError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}
