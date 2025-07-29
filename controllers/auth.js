import { validateUser, validateUserEmailAndPassword } from "../schemas/user.js";

export class AuthController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  register = async (req, res) => {
    const result = validateUser(req.body);

    if (result.error)
      return res.status(400).json({ error: JSON.parse(result.error.message) });

    const newUser = await this.userModel.create({ input: result.data });

    return res.status(201).json({ user: newUser });
  };

  login = async (req, res) => {
    const result = validateUserEmailAndPassword(req.body);

    if (result.error)
      return res.status(400).json({ error: JSON.parse(result.error.message) });

    const user = await this.userModel.login({ credentials: result.data });

    return res.status(200).json({ user });
  };
}
