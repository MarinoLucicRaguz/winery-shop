const express = require("express");
const UserController = require("../controllers/userController");
const router = express.Router();
const { isAdmin, protect } = require("../middleware/authMiddleware");

router.post("/:userId/favorites/wines/:wineId", UserController.addFavoriteWine);

router.delete(
  "/:userId/favorites/wines/:wineId",
  UserController.removeFavoriteWine
);

router.get("/names", protect, isAdmin, UserController.getAllNames);
router.get("/:username", protect, isAdmin, UserController.getUserByName);
router.get("/:userId", protect, isAdmin, UserController.getUserById);
router.get("/:userId/favorites/wines", UserController.getFavorites);

module.exports = router;
