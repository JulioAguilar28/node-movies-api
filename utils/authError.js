import { AppError } from "./appError.js";

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class UserNotCreatedError extends AppError {
  constructor(message = "User not created") {
    super(message, 400);
  }
}

export class DuplicatedEmailError extends AppError {
  constructor(message = "Duplicated email") {
    super(message, 409);
  }
}

export class UserNotFound extends AppError {
  constructor(message = "User not found") {
    super(message, 404);
  }
}
