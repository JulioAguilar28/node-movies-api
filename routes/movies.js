import { Router } from "express";

import { MovieController } from "../controllers/movies.js";
import { authHandler } from "../middlewares/authHandler.js";

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router();
  moviesRouter.use(authHandler);

  // Dependency Injection
  const movieController = new MovieController({ movieModel });

  moviesRouter.get("/", movieController.getAll);
  moviesRouter.post("/", movieController.create);

  moviesRouter.patch("/:id", movieController.update);
  moviesRouter.get("/:id", movieController.getById);
  moviesRouter.delete("/:id", movieController.delete);

  return moviesRouter;
};
