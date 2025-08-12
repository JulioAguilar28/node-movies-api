import { pool } from "../../sql/db.js";
import { DuplicatedFavoritesMovieError } from "../../utils/favoritesError.js";
import { AppError } from "../../utils/appError.js";

export class FavoritesModel {
  static async getAll({ userId }) {
    const [movies] = await pool.query(
      `
      SELECT M.title, M.year, M.director, M.duration, M.poster, M.rate
      FROM users_favorites UF
      JOIN users U ON U.id = UF.user_id
      JOIN movies M ON M.id = UF.movie_id
      WHERE UF.user_id = UUID_TO_BIN(?);
    `,
      [userId],
    );

    return movies;
  }

  static async add({ userId, movieId }) {
    try {
      await pool.query(
        `INSERT INTO users_favorites(user_id, movie_id) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?))`,
        [userId, movieId],
      );

      const [movies] = await pool.query(
        "SELECT BIN_TO_UUID(id) id, title, year, director, poster, rate FROM movies WHERE id = UUID_TO_BIN(?);",
        [movieId],
      );

      return movies[0];
    } catch (reason) {
      console.error(`FavoritesModel | add() ${reason}`);
      const error = parseMySqlReason(reason.code);

      throw error;
    }
  }
}

const parseMySqlReason = (code) => {
  switch (code) {
    case "ER_DUP_ENTRY":
      return new DuplicatedFavoritesMovieError(
        "This movie is already in your favorites",
      );

    default:
      return new AppError();
  }
};
