import bcrypt from "bcrypt";
import crypto from "crypto";

import { readJSON } from "../../utils/utils.js";

const users = readJSON("../users.json");

const saltRounds = 10;

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
      return newUser;
    } catch (error) {
      console.error(`UserModel | create(): ${error}`);

      throw new Error("Failed to create user");
    }
  }

  static async login({ email, password }) {
    try {
      const user = users.find((user) => user.email === email);
      if (!user) throw new Error("User not found");

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error("Invalid password");

      return user;
    } catch (error) {
      console.error(`UserModel | login(): ${error}`);

      throw new Error("Failed to login");
    }
  }
}
