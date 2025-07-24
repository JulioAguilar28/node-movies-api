import { z } from "zod";

const userSchema = z.object({
  name: z.string({
    invalid_type_error: "Name must be a string",
    required_error: "Name is required",
  }),
  lastName: z.string({
    invalid_type_error: "lastName must be a string",
    required_error: "lastName is required",
  }),
  email: z.string().email("Email must be a valid email"),
  password: z.string({
    invalid_type_error: "Password must be a string",
    required_error: "Password is required",
  }),
});

/**
 * Validates userSchema to create a valid user
 * @param {*} object values to create an User
 * @returns userSchema
 */
export function validateUser(object) {
  return userSchema.safeParse(object);
}

const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

export function validateUserEmailAndPassword(input) {
  return loginSchema.safeParse(input);
}
