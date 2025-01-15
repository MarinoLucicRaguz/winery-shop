const ReviewRepository = require("../repositories/reviewRepository");
const WineRepository = require("../repositories/wineRepository");

class ReviewController {
  static async addReview(req, res) {
    const { wineId, rating, comment } = req.body;
    const userId = req.user.id;

    try {
      const wine = await WineRepository.getWineById(wineId);
      if (!wine) {
        return res.status(404).json({ message: "Wine not found" });
      }

      const newReview = await ReviewRepository.createReview({
        wine: wineId,
        rating,
        comment,
        user: userId,
      });

      res.status(201).json(newReview);
    } catch (err) {
      console.error("Error adding review:", err);
      res.status(500).json({ message: "Failed to add review" });
    }
  }

  static async getReviewsForWine(req, res) {
    const { wineId } = req.params;

    try {
      const reviews = await ReviewRepository.getReviewsForWine(wineId);
      res.status(200).json(reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  }
}

module.exports = ReviewController;
