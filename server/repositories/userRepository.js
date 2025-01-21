const User = require("../models/User");

class UserRepository {
  static async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  static async findByEmail(email) {
    return await User.findOne({ email });
  }

  static async findByUsername(username) {
    return await User.findOne({ username });
  }

  static async findById(id) {
    return await User.findOne({ _id: id });
  }

  static async addFavoriteWine(userId, wineId) {
    const user = await this.findById(userId);

    if (!user.favorites.wines.includes(wineId)) {
      user.favorites.wines.push(wineId);
      await user.save();
    }
    return user;
  }

  static async removeFavoriteWine(userId, wineId) {
    const user = await this.findById(userId);

    user.favorites.wines = user.favorites.wines.filter(
      (id) => id.toString() !== wineId
    );
    await user.save();
    return user;
  }

  static async getUserFavorites(userId) {
    const user = await User.findById(userId).populate("favorites.wines");
    return user.favorites.wines;
  }
}

module.exports = UserRepository;
