// TODO: UserModel should be passed as argument creating Dependecy Injection
import { UserModel } from "../models/local-file-system/user.js";

export class AuthController {
  register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const newUser = await UserModel.create({ email, password });

    if (!newUser)
      return res.status(500).json({ error: "Failed to create user" });

    return res.status(201).json({ user: newUser });
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const newUser = await UserModel.login({ email, password });
      return res.status(201).json({ user: newUser });
    } catch (error) {
      console.error(`AuthController | login(): ${error}`);
      return res.status(500).json({ error: "Email or Password is incorrect" });
    }
  };
}
