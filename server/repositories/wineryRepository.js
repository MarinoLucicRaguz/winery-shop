const Winery = require("../models/Winery");

class WineryRepository {
  static async createWinery(wineryData) {
    const winery = new Winery(wineryData);
    return await winery.save();
  }

  static async getAllWineries() {
    return await Winery.find();
  }

  static async getWineryById(id) {
    return await Winery.findById(id);
  }

  static async getWineryByName(name) {
    return await Winery.findOne({ name });
  }

  static async updateWinery(id, wineryData) {
    return await Winery.findByIdAndUpdate(id, wineryData, { new: true });
  }

  static async deleteWinery(id) {
    return await Winery.findByIdAndDelete(id);
  }
}

module.exports = WineryRepository;
