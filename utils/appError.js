/**
 * Class for AppErrors
 */
export class AppError extends Error {
  statusCode;

  constructor(message = "Internal Server Error", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
