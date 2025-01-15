const WineRepository = require("../repositories/wineRepository");
const WineryRepository = require("../repositories/wineryRepository");

class WineController {
  static async createWine(req, res) {
    const {
      name,
      type,
      grapeVariety,
      alcoholContent,
      vintage,
      price,
      winery,
      description,
    } = req.body;

    try {
      const existingWinery = await WineryRepository.getWineryById(winery);
      if (!existingWinery) {
        return res.status(404).json({ message: "Winery not found" });
      }

      const newWine = await WineRepository.createWine({
        name,
        type,
        grapeVariety,
        alcoholContent,
        vintage,
        price,
        winery,
        description,
      });

      res.status(201).json(newWine);
    } catch (err) {
      console.error("Error creating wine:", err);
      res.status(500).json({ message: "Failed to create wine" });
    }
  }

  static async getAllWines(req, res) {
    try {
      const wines = await WineRepository.getAllWines();
      res.status(200).json(wines);
    } catch (err) {
      console.error("Error fetching wines:", err);
      res.status(500).json({ message: "Failed to fetch wines" });
    }
  }

  static async getWineById(req, res) {
    const { id } = req.params;

    try {
      const wine = await WineRepository.getWineById(id);
      if (!wine) {
        return res.status(404).json({ message: "Wine not found" });
      }
      res.status(200).json(wine);
    } catch (err) {
      console.error("Error fetching wine by ID:", err);
      res.status(500).json({ message: "Failed to fetch wine" });
    }
  }

  static async updateWine(req, res) {
    const { id } = req.params;
    const {
      name,
      type,
      grapeVariety,
      alcoholContent,
      vintage,
      price,
      winery,
      description,
    } = req.body;

    try {
      const updatedWine = await WineRepository.updateWine(id, {
        name,
        type,
        grapeVariety,
        alcoholContent,
        vintage,
        price,
        winery,
        description,
      });

      if (!updatedWine) {
        return res.status(404).json({ message: "Wine not found" });
      }

      res.status(200).json(updatedWine);
    } catch (err) {
      console.error("Error updating wine:", err);
      res.status(500).json({ message: "Failed to update wine" });
    }
  }

  static async deleteWine(req, res) {
    const { id } = req.params;

    try {
      const deletedWine = await WineRepository.deleteWine(id);
      if (!deletedWine) {
        return res.status(404).json({ message: "Wine not found" });
      }
      res.status(200).json({ message: "Wine deleted successfully" });
    } catch (err) {
      console.error("Error deleting wine:", err);
      res.status(500).json({ message: "Failed to delete wine" });
    }
  }
}

module.exports = WineController;
