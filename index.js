import express, { json } from "express";
import dotenv from "dotenv";
import pc from "picocolors";

// DotEnv config
dotenv.config();

import { createMovieRouter } from "./routes/movies.js";
import { createAuthRouter } from "./routes/auth.js";
import { createFavoritesMoviesRouter } from "./routes/favorites.js";
import { corsMiddleware } from "./middlewares/cors.js";

// Global Error Handler
import { errorHandler } from "./middlewares/errorHandler.js";
import { camelCaseBody } from "./middlewares/camelcaseKeys.js";

import { MovieModel } from "./models/mysql/movie.js";
import { UserModel } from "./models/mysql/user.js";
import { FavoritesModel } from "./models/mysql/favorites.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(json());
app.use(corsMiddleware());

app.disable("x-powered-by");

// Middleware to transform req.body to camelCase
app.use(camelCaseBody);

// Auth Router
app.use("/api/auth", createAuthRouter({ userModel: UserModel }));

// Favorites Router
app.use(
  "/api/t/movies/favorites",
  createFavoritesMoviesRouter({ favoritesModel: FavoritesModel }),
);

// Movies Router
app.use("/api/t/movies", createMovieRouter({ movieModel: MovieModel }));

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(pc.yellow(`🔔 listen on port ${PORT}`));
});
