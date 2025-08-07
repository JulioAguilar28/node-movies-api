import fs from "fs";

import { pool } from "../db.js";
import { readJSON } from "../../utils/utils.js";

const movies = readJSON("../sql/seeds/moviesSeed.json");
const moviesGenres = readJSON("../sql/seeds/moviesGenresSeed.json");

const getMoviesSqlAndValues = () => {
  const values = movies.reduce((acc, current) => {
    const { id, title, year, director, poster, rate, duration } = current;
    acc.push([id, title, year, director, poster, Number(rate), duration]);

    return acc;
  }, []);

  const placeholders = values
    .map(() => "(UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)")
    .join(", ");
  const flattenValues = values.flat();
  const sqlQuery = `INSERT INTO movies(id, title, year, director, poster, rate, duration) VALUES ${placeholders}`;

  return { sqlQuery, values: flattenValues };
};

const getMoviesGenresSqlAndValues = () => {
  const values = moviesGenres.reduce((acc, current) => {
    const { movie_id, genre_id } = current;
    acc.push([movie_id, genre_id]);

    return acc;
  }, []);

  const placeholders = values.map(() => "(UUID_TO_BIN(?), ?)").join(", ");
  const flattenValues = values.flat();
  const sqlQuery = `INSERT INTO movies_genres(movies_id, genres_id) VALUES ${placeholders}`;

  return { sqlQuery, values: flattenValues };
};

async function moviesSeed() {
  let connection;

  try {
    connection = await pool.getConnection();
    const { sqlQuery: moviesQuery, values: moviesValues } =
      getMoviesSqlAndValues();
    const { sqlQuery: moviesGenreQuery, values: moviesGenreValues } =
      getMoviesGenresSqlAndValues();

    /**
     * Remove all movies rows to avoid
     * duplicity error
     */
    await connection.execute("DELETE FROM movies");
    await connection.execute(moviesQuery, moviesValues);

    /**
     * Remove all movies_genres rows to avoid
     * duplicity error
     */
    await connection.execute("DELETE FROM movies_genres");
    await connection.execute(moviesGenreQuery, moviesGenreValues);

    console.log("Movies Table seed succesfully");
  } catch (reason) {
    console.error(`MoviesSeed | moviesSeed(): ${reason}`);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

moviesSeed();
