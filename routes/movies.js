import { Router } from "express";

import { MovieController } from "../controllers/movies.js";

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router();

  // Dependency Injection
  const movieController = new MovieController({ movieModel });

  moviesRouter.get("/", movieController.getAll);
  moviesRouter.post("/", movieController.create);

  moviesRouter.patch("/:id", movieController.update);
  moviesRouter.get("/:id", movieController.getById);
  moviesRouter.delete("/:id", movieController.delete);

  return moviesRouter;
};
