import { Router } from "express";

import { authHandler } from "../middlewares/authHandler.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { FavoritesController } from "../controllers/favorites.js";

export const createFavoritesMoviesRouter = ({ favoritesModel }) => {
  const favoritesRouter = Router();
  favoritesRouter.use(authHandler);

  const favoritesController = new FavoritesController({ favoritesModel });

  favoritesRouter.get("/", asyncHandler(favoritesController.getAll));
  favoritesRouter.post("/:id", asyncHandler(favoritesController.add));

  return favoritesRouter;
};
