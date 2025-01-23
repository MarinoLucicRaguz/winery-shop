import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";
import "./WinePage.css";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Modal from "../components/Modal";
import { getUserFromToken } from "../utils/auth";

const WinePage = () => {
  const [wines, setWines] = useState([]);
  const [wineries, setWineries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ type: "", price: "", wineryId: "" });
  const [sort, setSort] = useState("name");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const { cartItems, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUserFromToken();
        setCurrentUser(user);

        const winesResponse = await axiosInstance.get("/wine");
        const wineriesResponse = await axiosInstance.get("/wineries");
        const reviewsResponse = await axiosInstance.get("/reviews");

        setWines(winesResponse.data);
        setWineries(wineriesResponse.data);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (currentUser?.id) {
          const response = await axiosInstance.get(
            `/users/${currentUser.id}/favorites/wines`
          );
          const favorites = response.data.favorites || response.data;
          setFavoriteIds(favorites.map((wine) => wine._id));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const winesWithDetails = wines.map((wine) => ({
    ...wine,
    reviews: reviews.filter((review) => review.wine === wine._id),
    winery: wineries.find((winery) => winery._id === wine.winery._id),
  }));

  const filteredWines = winesWithDetails.filter((wine) => {
    let isValid = true;

    if (filters.type && wine.type !== filters.type) {
      isValid = false;
    }
    if (filters.price && filters.price > 0 && wine.price > filters.price) {
      isValid = false;
    }
    if (
      filters.wineryId &&
      wine.winery &&
      wine.winery._id !== filters.wineryId
    ) {
      isValid = false;
    }

    return isValid;
  });

  const sortedWines = [...filteredWines].sort((a, b) => {
    if (sort === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sort === "price") {
      return a.price - b.price;
    }
    return 0;
  });

  const handleDelete = async (wineId) => {
    try {
      await axiosInstance.delete(`/wine/${wineId}`);
      setWines((prevWines) => prevWines.filter((wine) => wine._id !== wineId));
      const wineInCart = cartItems.find((item) => item._id === wineId);
      if (wineInCart) {
        removeFromCart(wineId);
      }
      setModalMessage("Wine deleted successfully");
    } catch (err) {
      setError("Failed to delete wine.");
    }
  };

  const handleFavorite = async (wineId) => {
    try {
      await axiosInstance.post(
        `/users/${currentUser.id}/favorites/wines/${wineId}`
      );
      setModalMessage("Wine added to favorites.");

      setFavoriteIds((prevIds) => [...prevIds, wineId]);
    } catch (err) {
      setModalMessage("Failed to add favorite.");
    }
  };

  if (loading) return <p>Loading wines...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage("")} />
      )}
      <div className="wine-list">
        {currentUser?.role === "admin" && (
          <div className="filters-container">
            <Link to="/wines/add" className="add-wine-button">
              Add Wine
            </Link>
          </div>
        )}
        <div className="wine-grid">
          {sortedWines.map((wine) => {
            const isFavorite = favoriteIds.includes(wine._id);
            return (
              <div className="wine-item" key={wine._id}>
                <div className="wine-info">
                  <h3>{wine.name}</h3>
                  <p>Type: {wine.type}</p>
                  <p>Price: {wine.price}€</p>
                  <p>
                    Winery: {wine.winery ? wine.winery.name : "Unknown Winery"}
                  </p>
                  <button
                    onClick={() => {
                      addToCart(wine);
                      setModalMessage("Wine added to cart.");
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="wine-reviews">
                  <p>Reviews: {wine.reviews.length}</p>
                  {wine.reviews.length > 0 && (
                    <p>
                      Average Rating:{" "}
                      {(
                        wine.reviews.reduce(
                          (sum, review) => sum + review.rating,
                          0
                        ) / wine.reviews.length
                      ).toFixed(1)}
                      /5
                    </p>
                  )}
                </div>
                <div className="wine-buttons">
                  <Link to={`/wines/${wine._id}`} className="wine-details-link">
                    View Details
                  </Link>
                  {currentUser?.role === "admin" && (
                    <button
                      onClick={() => handleDelete(wine._id)}
                      className="delete-button"
                    >
                      Delete Wine
                    </button>
                  )}
                  <button
                    onClick={() => handleFavorite(wine._id)}
                    className={`favorite-button ${
                      isFavorite ? "favorited" : ""
                    }`}
                  >
                    {isFavorite ? "Favorited" : "Favorite"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default WinePage;
