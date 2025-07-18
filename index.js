import express, { json } from "express";
import pc from "picocolors";

import { createMovieRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";

import { MovieModel } from "./models/mysql/movie.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(json());
app.use(corsMiddleware());

app.disable("x-powered-by");

// Movies Router
app.use("/movies", createMovieRouter({ movieModel: MovieModel }));

app.listen(PORT, () => {
  console.log(pc.yellow(`🔔 listen on port ${PORT}`));
});
