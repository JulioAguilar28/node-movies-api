import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const generateHashedPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const matchPassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};
