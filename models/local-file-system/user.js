import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { readJSON } from "../../utils/utils.js";
import { AppError } from "../../utils/appError.js";

const users = readJSON("../users.json");

const saltRounds = 10;

class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class UserNotCreatedError extends AppError {
  constructor(message = "User not created") {
    super(message, 400);
  }
}

export class UserModel {
  static async create({ email, password }) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = {
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
      };

      users.push(newUser);
      console.log("Available users:", users);

      const { password: _, ...createdUser } = newUser;

      return createdUser;
    } catch (error) {
      console.error(`UserModel | create(): ${error}`);

      throw error;
    }
  }

  static async login({ email, password }) {
    try {
      const user = users.find((user) => user.email === email);
      if (!user) throw new AuthError("User or password is incorrect");

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new AuthError("User or password is incorrect");

      const { password: _, ...currentUser } = user;

      const token = jwt.sign(
        { user: currentUser },
        "super-mega-hyper-secret-key",
        {
          expiresIn: "1h",
        }
      );

      return { ...currentUser, token };
    } catch (error) {
      console.error(`UserModel | login(): ${error}`);

      throw error;
    }
  }
}
