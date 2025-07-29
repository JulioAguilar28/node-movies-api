import { Router } from "express";

import { AuthController } from "../controllers/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const createAuthRouter = ({ userModel }) => {
  const authRouter = Router();

  const authController = new AuthController({ userModel });

  authRouter.post("/login", asyncHandler(authController.login));
  authRouter.post("/register", asyncHandler(authController.register));

  return authRouter;
};
