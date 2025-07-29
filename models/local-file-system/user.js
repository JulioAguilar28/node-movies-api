import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { readJSON } from "../../utils/utils.js";
import { AuthError } from "../../utils/authError.js";

const users = readJSON("../users.json");

const saltRounds = 10;
export class UserModel {
  static async create({ input }) {
    try {
      const hashedPassword = await bcrypt.hash(input.password, saltRounds);

      const newUser = {
        ...input,
        id: crypto.randomUUID(),
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

  static async login({ credentials }) {
    try {
      const user = users.find((user) => user.email === credentials.email);
      if (!user) throw new AuthError("User or password is incorrect");

      const match = await bcrypt.compare(credentials.password, user.password);
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
