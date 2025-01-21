const express = require("express");
const UserController = require("../controllers/userController");
const router = express.Router();

router.post("/:userId/favorites/wines/:wineId", UserController.addFavoriteWine);

router.delete(
  "/:userId/favorites/wines/:wineId",
  UserController.removeFavoriteWine
);

router.get("/:userId/favorites/wines", UserController.getFavorites);

module.exports = router;
