import bcrypt from "bcrypt";
import crypto from "crypto";

import { readJSON } from "../../utils/utils.js";
import { AuthError } from "../../utils/authError.js";
import { signAuthToken } from "../../utils/jwt.js";
import { generateHashedPassword, matchPassword } from "../../utils/password.js";

const users = readJSON("../users.json");
export class UserModel {
  static async create({ input }) {
    try {
      const hashedPassword = await generateHashedPassword(input.password);

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

      const match = await matchPassword(credentials.password, user.password);
      if (!match) throw new AuthError("User or password is incorrect");

      const { password: _, ...currentUser } = user;

      const token = signAuthToken({ user: currentUser });

      return { ...currentUser, token };
    } catch (error) {
      console.error(`UserModel | login(): ${error}`);

      throw error;
    }
  }
}
