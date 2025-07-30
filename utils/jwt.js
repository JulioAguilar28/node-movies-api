import jwt from "jsonwebtoken";
import { AuthError } from "./authError.js";

export const signAuthToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const getAuthTokenPayload = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (reason) {
    throw new AuthError("Invalid Token");
  }
};
