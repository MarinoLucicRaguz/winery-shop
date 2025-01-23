import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Modal from "../../components/Modal";
import "./WineDetails.css";
import { getUserFromToken } from "../../utils/auth";

const WineDetails = () => {
  const { id } = useParams();
  const [wine, setWine] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); // State for the modal message
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchWineDetails = async () => {
      try {
        const user = getUserFromToken();
        const wineResponse = await axiosInstance.get(`/wine/${id}`);
        setWine(wineResponse.data);

        const reviewsResponse = await axiosInstance.get(`/reviews/${id}`);
        setReviews(reviewsResponse.data);

        const hasReviewed = reviewsResponse.data.some(
          (review) => review.user._id === user.id
        );
        setUserHasReviewed(hasReviewed);

        setLoading(false);
      } catch (err) {
        setError("Failed to load wine details or reviews.");
        setLoading(false);
      }
    };

    fetchWineDetails();
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const newReview = {
        wineId: id,
        rating: review.rating,
        comment: review.comment,
      };

      await axiosInstance.post("/reviews", newReview);

      const wineResponse = await axiosInstance.get(`/wine/${id}`);
      const reviewsResponse = await axiosInstance.get(`/reviews/${id}`);
      setWine(wineResponse.data);
      setReviews(reviewsResponse.data);

      setUserHasReviewed(true);
      setReview({ rating: 5, comment: "" });
    } catch (err) {
      setError("Failed to submit the review.");
    }
  };

  const addToCartHandler = () => {
    addToCart(wine);
    setModalMessage(`${wine.name} has been added to your cart.`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="wine-details">
      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage("")} />
      )}
      {wine && (
        <>
          <h1 className="wine-details-title">{wine.name}</h1>
          <div className="wine-info">
            <p>
              <strong>Type:</strong> {wine.type}
            </p>
            <p>
              <strong>Price:</strong> {wine.price}€
            </p>
            <p>
              <strong>Vintage:</strong> {wine.vintage}
            </p>
            <p>
              <strong>Alcohol Content:</strong> {wine.alcoholContent}%
            </p>
            <p>
              <strong>Grape Variety:</strong> {wine.grapeVariety}
            </p>
            <p>
              <strong>Description:</strong> {wine.description}
            </p>
            <button className="add-to-cart-button" onClick={addToCartHandler}>
              Add to Cart
            </button>
          </div>

          <div className="wine-reviews">
            <h3>Reviews</h3>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <p>
                    <strong>{review.user.username}</strong> ({review.rating}
                    /5): {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>

          {!userHasReviewed ? (
            <div className="review-form">
              <h3>Leave a Review</h3>
              <form onSubmit={submitReview}>
                <div className="form-group">
                  <label>Rating:</label>
                  <select
                    name="rating"
                    value={review.rating}
                    onChange={handleReviewChange}
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Comment:</label>
                  <textarea
                    name="comment"
                    value={review.comment}
                    onChange={handleReviewChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-review-button">
                  Submit Review
                </button>
              </form>
            </div>
          ) : (
            <p>You have already reviewed this wine.</p>
          )}
        </>
      )}
    </div>
  );
};

export default WineDetails;
