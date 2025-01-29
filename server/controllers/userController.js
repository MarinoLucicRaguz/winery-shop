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
      res.json({
        token,
        id: user._id,
        username: user.username,
        role: user.role,
      });
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

  static async addFavoriteWine(req, res) {
    const { userId, wineId } = req.params;
    try {
      const user = await UserRepository.addFavoriteWine(userId, wineId);
      res.json({
        message: "Wine added to favorites.",
        favorites: user.favorites.wines,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error adding favorite wine." });
    }
  }

  static async removeFavoriteWine(req, res) {
    const { userId, wineId } = req.params;
    try {
      const user = await UserRepository.removeFavoriteWine(userId, wineId);
      res.json({
        message: "Wine removed from favorites.",
        favorites: user.favorites.wines,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error removing favorite wine." });
    }
  }

  static async getFavorites(req, res) {
    const { userId } = req.params;
    try {
      const favorites = await UserRepository.getUserFavorites(userId);
      res.json({ favorites });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving favorites." });
    }
  }

  static async getAllNames(req, res){
    try{
      const response = await UserRepository.getAllNames();
      res.status(200).json(response);
    } catch(err){
      console.error(err);
      res.status(500).json({ message: "Error retrieving favorites." });
    }
  }

  static async getUserById(req, res){
    const {userId} = req.params;
    try{
      const user = await UserRepository.findById(userId);
      res.status(200).json(user)
    }catch(err){
      console.error(err)
      res.status(500).json({message: "error while retrieving user"})
    }
  }

  static async getUserByName(req, res){
    const {username} = req.params;
    try{
      const user = await UserRepository.findByUsername(username);
      res.status(200).json(user)
    }catch(err){
      console.error(err)
      res.status(500).json({message: "error while retrieving user"})
    }
  }
}

module.exports = UserController;
