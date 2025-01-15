const express = require("express");
const ReviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, ReviewController.addReview);
router.get("/:wineId", ReviewController.getReviewsForWine);

module.exports = router;
