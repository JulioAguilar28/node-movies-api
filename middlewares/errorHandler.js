import { AppError } from "../utils/appError.js";

export const errorHandler = (err, _req, res, _next) => {
  console.log("Error Handler | err: ", err);

  const statusCode = err.statusCode || 500;
  const errorMsg = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: errorMsg });
};
