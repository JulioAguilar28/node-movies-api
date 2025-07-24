// TODO: UserModel should be passed as argument creating Dependecy Injection
import { UserModel } from "../models/local-file-system/user.js";

import { validateUser, validateUserEmailAndPassword } from "../schemas/user.js";

export class AuthController {
  register = async (req, res) => {
    const result = validateUser(req.body);

    if (result.error)
      return res.status(400).json({ error: JSON.parse(result.error.message) });

    const newUser = await UserModel.create(result.data);

    return res.status(201).json({ user: newUser });
  };

  login = async (req, res) => {
    const result = validateUserEmailAndPassword(req.body);

    if (result.error)
      return res.status(400).json({ error: JSON.parse(result.error.message) });

    const user = await UserModel.login(result.data);

    return res.status(200).json({ user });
  };
}
