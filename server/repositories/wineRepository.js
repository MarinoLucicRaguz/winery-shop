const Wine = require("../models/Wine");

class WineRepository {
  static async createWine(wineData) {
    const wine = new Wine(wineData);
    return await wine.save();
  }

  static async getAllWines() {
    return await Wine.find().populate("winery");
  }

  static async getWineById(id) {
    return await Wine.findById(id).populate("winery");
  }

  static async updateWine(id, wineData) {
    return await Wine.findByIdAndUpdate(id, wineData, { new: true });
  }

  static async deleteWine(id) {
    return await Wine.findByIdAndDelete(id);
  }
}

module.exports = WineRepository;
