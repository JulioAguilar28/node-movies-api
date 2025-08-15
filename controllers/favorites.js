export class FavoritesController {
  constructor({ favoritesModel }) {
    this.favoritesModel = favoritesModel;
  }

  getAll = async (req, res) => {
    const movies = await this.favoritesModel.getAll({ userId: req.user.id });
    return res.status(200).json({ movies });
  };

  add = async (req, res) => {
    const { id: movieId } = req.params;

    const movie = await this.favoritesModel.add({
      userId: req.user.id,
      movieId,
    });
    if (!movie) res.status(404).json({ message: "Movie not found" });

    return res
      .status(200)
      .json({ message: "The movie has been added as favorite" });
  };

  delete = async (req, res) => {
    const { id: movieId } = req.params;

    const result = await this.favoritesModel.delete({
      userId: req.user.id,
      movieId,
    });
    if (!result)
      return res
        .status(404)
        .json({ message: "Movie not found on your favorites" });

    return res
      .status(200)
      .json({ message: "Movie has been removed from your favorites" });
  };
}
