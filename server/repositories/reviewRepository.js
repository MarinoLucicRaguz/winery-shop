const Review = require("../models/Review");

class ReviewRepository {
  static async createReview(reviewData) {
    const review = new Review(reviewData);
    return await review.save();
  }

  static async getReviewsForWine(wineId) {
    return await Review.find({ wine: wineId }).populate("user");
  }
}

module.exports = ReviewRepository;
