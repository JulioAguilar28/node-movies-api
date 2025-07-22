// TODO: UserModel should be passed as argument creating Dependecy Injection
import { UserModel } from "../models/local-file-system/user.js";
import { readJSON } from "../utils/utils.js";

const users = readJSON("../user.json");

export class AuthController {
  login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const newUser = await UserModel.login(email, password);

    if (!newUser)
      return res.status(500).json({ error: "Email or Password are incorrect" });

    users.push(newUser);
    return res.status(201).json({ user: newUser });
  };
}
