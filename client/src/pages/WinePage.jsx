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
  const [filters, setFilters] = useState({ type: "", price: "", wineryId: "" });
  const [sort, setSort] = useState("name");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const { cartItems, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const user = getUserFromToken();
      setCurrentUser(user);

      try {
        const winesRes = await axiosInstance.get("/wine");
        setWines(winesRes.data || []);
      } catch (err) {
        console.warn("Could not load wines:", err);
      }

      try {
        const wineriesRes = await axiosInstance.get("/wineries");
        setWineries(wineriesRes.data || []);
      } catch (err) {
        console.warn("Could not load wineries:", err);
      }

      try {
        const reviewsRes = await axiosInstance.get("/reviews");
        setReviews(reviewsRes.data || []);
      } catch (err) {
        console.warn("Could not load reviews:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser?.id) return;
      try {
        const response = await axiosInstance.get(
          `/users/${currentUser.id}/favorites/wines`
        );
        const favorites = response.data.favorites || response.data || [];
        setFavoriteIds(favorites.map((wine) => wine._id));
      } catch (err) {
        console.warn("Could not load favorites:", err);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const winesWithDetails = wines.map((wine) => {
    const wineReviews = reviews.filter((review) => review.wine === wine._id);
    const foundWinery = wineries.find((w) => w._id === wine?.winery?._id);
    return {
      ...wine,
      reviews: wineReviews,
      winery: foundWinery || null,
    };
  });

  const filteredWines = winesWithDetails.filter((wine) => {
    let isValid = true;
    if (filters.type && wine.type?.toLowerCase() !== filters.type.toLowerCase()) {
      isValid = false;
    }
    if (
      filters.price &&
      Number(filters.price) > 0 &&
      wine.price > Number(filters.price)
    ) {
      isValid = false;
    }
    if (filters.wineryId && wine.winery?._id !== filters.wineryId) {
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
      setWines((prev) => prev.filter((wine) => wine._id !== wineId));
      const wineInCart = cartItems.find((item) => item._id === wineId);
      if (wineInCart) removeFromCart(wineId);
      setModalMessage("Wine deleted successfully");
    } catch (err) {
      console.error("Failed to delete wine:", err);
    }
  };

  const handleFavorite = async (wineId) => {
    if (!currentUser?.id) {
      setModalMessage("Please log in to add favorites.");
      return;
    }
    try {
      await axiosInstance.post(
        `/users/${currentUser.id}/favorites/wines/${wineId}`
      );
      setModalMessage("Wine added to favorites.");
      setFavoriteIds((prev) => [...prev, wineId]);
    } catch (err) {
      console.error("Failed to add favorite:", err);
      setModalMessage("Failed to add favorite.");
    }
  };

  if (loading) {
    return <p>Loading wines...</p>;
  }

  return (
    <>
      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage("")} />
      )}

      <div className="wine-list">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="type">Type: </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="red">Red</option>
              <option value="white">White</option>
              <option value="rose">Rose</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="price">Max Price: </label>
            <input
              id="price"
              name="price"
              type="number"
              value={filters.price}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="wineryId">Winery: </label>
            <select
              id="wineryId"
              name="wineryId"
              value={filters.wineryId}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              {wineries.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort">Sort By: </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>

          {currentUser?.role === "admin" && (
            <Link to="/wines/add" className="add-wine-button">
              Add Wine
            </Link>
          )}
        </div>

        <div className="wine-grid">
          {sortedWines.length === 0 && <p>No wines found.</p>}
          {sortedWines.map((wine) => {
            const isFavorite = favoriteIds.includes(wine._id);
            return (
              <div className="wine-item" key={wine._id}>
                <div className="wine-info">
                  <h3>{wine.name}</h3>
                  <p>Type: {wine.type}</p>
                  <p>Price: {wine.price}€</p>
                  <p>Winery: {wine.winery?.name || "Unknown Winery"}</p>
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
                    className={`favorite-button ${isFavorite ? "favorited" : ""}`}
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
