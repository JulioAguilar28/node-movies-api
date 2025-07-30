import { AuthError } from "../utils/authError.js";
import { getAuthTokenPayload } from "../utils/jwt.js";

export function authHandler(req, _res, next) {
  const { authorization } = req.headers;

  if (!authorization) throw new AuthError("Invalid Token");

  const token = authorization.split("Bearer ");
  const { user } = getAuthTokenPayload(token[1]);

  // Add Current User into the request
  req.user = user;

  next();
}
