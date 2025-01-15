const UserRepository = require("../repositories/userRepository");

class UserController {
  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserRepository.findByEmail(email);
      if (!user)
        return res.status(400).json({ message: "Invalid credentials." });

      const isMatch = await user.matchPassword(password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = user.generateAuthToken();
      res.json({ token });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Server error while logging in, please try again." });
    }
  }

  static async register(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      let user = await UserRepository.findByEmail(email);
      if (user)
        return res.status(400).json({ message: "Email already in use." });

      user = await UserRepository.findByUsername(username);
      if (user)
        return res.status(400).json({ message: "Username already in use." });

      const newUser = { username, email, password };

      const createdUser = await UserRepository.createUser(newUser);
      const token = createdUser.generateAuthToken();
      res.status(201).json({ token });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Server error while registering, please try again." });
    }
  }
}

module.exports = UserController;
