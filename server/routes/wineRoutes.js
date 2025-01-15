const express = require("express");
const WineController = require("../controllers/WineController");
const { isAdmin, protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", isAdmin, protect, WineController.createWine);
router.get("/", protect, WineController.getAllWines);
router.get("/:id", protect, WineController.getWineById);
router.put("/:id", isAdmin, protect, WineController.updateWine);
router.delete("/:id", isAdmin, protect, WineController.deleteWine);

module.exports = router;
