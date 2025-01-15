const express = require("express");
const WineryController = require("../controllers/WineryController");
const { isAdmin, protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, isAdmin, WineryController.createWinery);
router.get("/", protect, WineryController.getAllWineries);
router.get("/:id", protect, WineryController.getWineryById);
router.put("/:id", protect, WineryController.updateWinery);
router.delete("/:id", protect, isAdmin, WineryController.deleteWinery);

module.exports = router;
