import { pool } from "../../sql/db.js";

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const [movies] = await pool.query(
        `
        SELECT
          BIN_TO_UUID(M.id) as id,
          M.title,
          M.year,
          M.director,
          M.duration,
          M.poster,
          M.rate,
          G.name as genre
        FROM movies_genres MG
        JOIN genres G ON G.id = MG.genres_id
        JOIN movies M ON M.id = MG.movies_id
        WHERE G.name LIKE ?
        `,
        [genre]
      );

      return movies;
    }

    const [movies] = await pool.query(
      "SELECT BIN_TO_UUID(id) id, title, year, director, poster, rate FROM movies;"
    );

    return movies;
  }

  static async getById({ id }) {
    const [movies] = await pool.query(
      "SELECT BIN_TO_UUID(id) id, title, year, director, poster, rate FROM movies WHERE id = UUID_TO_BIN(?);",
      [id]
    );

    return movies[0];
  }

  static async create({ input }) {
    const { title, year, director, duration, poster, rate } = input;

    // Generate a uuid using mysql
    const [uuidResult] = await pool.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      // Insert a movie into database
      await pool.query(
        `
        INSERT INTO movies (id, title, year, director, duration, poster, rate) VALUES
        (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);
      `,
        [title, year, director, duration, poster, rate]
      );
    } catch (e) {
      throw new Error("Could not create the movie");
    }

    // Getting the created movie
    const movie = await MovieModel.getById({ id: uuid });
    return movie;
  }

  static async delete({ id }) {
    try {
      const [results] = await pool.query(
        `
        DELETE FROM movies WHERE id = UUID_TO_BIN(?);
        `,
        [id]
      );

      return results.affectedRows > 0;
    } catch (e) {
      throw new Error("Could not delete the movie");
    }
  }

  static async update({ id, input }) {
    const fieldsToBeModifed = Object.keys(input)
      .map((field) => `${field} = ?`)
      .join(", ");
    const valuesToBeModifed = Object.values(input);

    try {
      await pool.query(
        `
        UPDATE movies SET ${fieldsToBeModifed} WHERE id = UUID_TO_BIN(?);
        `,
        [...valuesToBeModifed, id]
      );

      const movie = await MovieModel.getById({ id });
      return movie;
    } catch (e) {
      throw new Error("Could not update the movie");
    }
  }
}
