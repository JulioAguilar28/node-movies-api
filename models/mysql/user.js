import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { CONFIG } from "../../sql/config.js";
import {
  AuthError,
  DuplicatedEmailError,
  UserNotFound,
} from "../../utils/authError.js";
import { AppError } from "../../utils/appError.js";

const connection = await mysql.createConnection(CONFIG);

const saltRounds = 10;

const generateHashedPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const matchPassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

export class UserModel {
  static async getById({ id }) {
    const [users] = await connection.query(
      `
      SELECT BIN_TO_UUID(id) id, name, last_name, email
      FROM users
      WHERE id = UUID_TO_BIN(?)
      `,
      [id]
    );

    return users[0];
  }

  static async getByEmail({ email }) {
    try {
      const [users] = await connection.query(
        `
        SELECT BIN_TO_UUID(id) id, name, last_name, email, password
        FROM users
        WHERE email = ?
        `,
        [email]
      );

      console.log({ users });

      return users[0];
    } catch (reason) {
      console.error(`UserModel | geyByAttribute() ${reason}`);

      throw reason;
    }
  }

  static async create({ input }) {
    const { name, lastName, email, password } = input;

    const hashedPassword = await generateHashedPassword(password);

    // Generate a uuid using mysql
    const [uuidResult] = await connection.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      await connection.query(
        `
        INSERT INTO users (id, name, last_name, email, password)
        VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?)
        `,
        [name, lastName, email, hashedPassword]
      );
    } catch (reason) {
      console.error(`UserModel | create(): ${reason}`);
      const error = parseMySqlReason(reason.code);

      throw error;
    }

    // Get the created user
    const user = await UserModel.getById({ id: uuid });
    return user;
  }

  static async login({ credentials }) {
    const user = await UserModel.getByEmail({ email: credentials.email });
    if (!user) throw new AuthError("User or password is incorrect");

    const match = matchPassword(credentials.password, user.password);
    if (!match) throw new AuthError("User or password is incorrect");

    const { password: _, ...currentUser } = user;

    // TODO: Add secret key to .env file
    // Author: JAM
    // Date: 2025-07-28
    const token = jwt.sign(
      { user: currentUser },
      "super-mega-hyper-secrey-key",
      {
        expiresIn: "1h",
      }
    );

    return { ...currentUser, token };
  }
}

const parseMySqlReason = (code) => {
  switch (code) {
    case "ER_DUP_ENTRY":
      return new DuplicatedEmailError();

    default:
      return new AppError();
  }
};
