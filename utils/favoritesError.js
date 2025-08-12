import { AppError } from "./appError.js";

export class DuplicatedFavoritesMovieError extends AppError {
  constructor(message = "Duplicated Favorites Movie") {
    super(message, 409);
  }
}

export class FavoriteMovieNotFound extends AppError {
  constructor(message = "User not found") {
    super(message, 404);
  }
}
