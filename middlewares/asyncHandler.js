/**
 * Function to handle async errors globally
 * @param {async function to be executed for global error handling} fn
 * @returns void
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
