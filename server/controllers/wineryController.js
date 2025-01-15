const WineryRepository = require("../repositories/wineryRepository"); // Only importing the repository

class WineryController {
  static async createWinery(req, res) {
    const { name, foundingYear, country, description, logoUrl } = req.body;

    try {
      const existingWinery = await WineryRepository.getWineryByName(name);
      if (existingWinery) {
        return res
          .status(400)
          .json({ message: "Winery with this name already exists" });
      }

      const newWinery = await WineryRepository.createWinery({
        name,
        foundingYear,
        country,
        description,
        logoUrl,
      });

      res.status(201).json(newWinery);
    } catch (err) {
      console.error("Error creating winery:", err);
      res.status(500).json({ message: "Failed to create winery" });
    }
  }

  static async getAllWineries(req, res) {
    try {
      const wineries = await WineryRepository.getAllWineries();
      res.status(200).json(wineries);
    } catch (err) {
      console.error("Error fetching wineries:", err);
      res.status(500).json({ message: "Failed to fetch wineries" });
    }
  }

  static async getWineryById(req, res) {
    const { id } = req.params;

    try {
      const winery = await WineryRepository.getWineryById(id);
      if (!winery) {
        return res.status(404).json({ message: "Winery not found" });
      }
      res.status(200).json(winery);
    } catch (err) {
      console.error("Error fetching winery by ID:", err);
      res.status(500).json({ message: "Failed to fetch winery by ID" });
    }
  }

  static async updateWinery(req, res) {
    const { id } = req.params;
    const { name, foundingYear, country, description, logoUrl } = req.body;

    try {
      const existingWinery = await WineryRepository.getWineryByName(name);
      if (existingWinery && existingWinery._id.toString() !== id) {
        return res
          .status(400)
          .json({ message: "Winery with this name already exists" });
      }

      const updatedWinery = await WineryRepository.updateWinery(id, {
        name,
        foundingYear,
        country,
        description,
        logoUrl,
      });

      if (!updatedWinery) {
        return res.status(404).json({ message: "Winery not found" });
      }

      res.status(200).json(updatedWinery);
    } catch (err) {
      console.error("Error updating winery:", err);
      res.status(500).json({ message: "Failed to update winery" });
    }
  }

  static async deleteWinery(req, res) {
    const { id } = req.params;

    try {
      const deletedWinery = await WineryRepository.deleteWinery(id);
      if (!deletedWinery) {
        return res.status(404).json({ message: "Winery not found" });
      }

      res.status(200).json({ message: "Winery deleted successfully" });
    } catch (err) {
      console.error("Error deleting winery:", err);
      res.status(500).json({ message: "Failed to delete winery" });
    }
  }
}

module.exports = WineryController;
