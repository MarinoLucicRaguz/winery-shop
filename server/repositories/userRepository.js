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
}

module.exports = UserRepository;
