// TODO: UserModel should be passed as argument creating Dependecy Injection
import { UserModel } from "../models/local-file-system/user.js";

export class AuthController {
  register = async (req, res) => {
    const { email, password } = req.body;

    // TODO: Validate email and password with Zod and Schema
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const newUser = await UserModel.create({ email, password });

    return res.status(201).json({ user: newUser });
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    // TODO: Validate email and password with Zod and Schema
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await UserModel.login({ email, password });

    return res.status(200).json({ user });
  };
}
