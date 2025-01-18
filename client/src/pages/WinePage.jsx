import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";
import "./WinePage.css";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const WinePage = () => {
  const [wines, setWines] = useState([]);
  const [wineries, setWineries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [filters, setFilters] = useState({ type: "", price: "", wineryId: "" });
  const [sort, setSort] = useState("name");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const winesResponse = await axiosInstance.get("/wine");
        const wineriesResponse = await axiosInstance.get("/wineries");
        const reviewsResponse = await axiosInstance.get("/reviews");

        setWines(winesResponse.data);
        setWineries(wineriesResponse.data);
        setReviews(reviewsResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

    console.log(wine);
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
      alert("Wine deleted successfully");
    } catch (err) {
      setError("Failed to delete wine.");
    }
  };

  return (
    <div className="wine-list">
      <div className="filters-container">
        <label>
          Type:
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="">All Types</option>
            <option value="Red">Red</option>
            <option value="White">White</option>
            <option value="Rose">Rose</option>
            <option value="Sparkling">Sparkling</option>
          </select>
        </label>
        <label>
          Max Price:
          <input
            type="number"
            value={filters.price}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, price: e.target.value }))
            }
          />
        </label>
        <label>
          Winery:
          <select
            value={filters.wineryId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, wineryId: e.target.value }))
            }
          >
            <option value="">All Wineries</option>
            {wineries.map((winery) => (
              <option key={winery._id} value={winery._id}>
                {winery.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sort by:
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </label>
        <Link to="/wines/add">
          <button className="add-wine-button">Add New Wine</button>
        </Link>
      </div>

      {loading && <p>Loading wines...</p>}
      {error && <p>{error}</p>}

      <div className="wine-grid">
        {sortedWines.map((wine) => (
          <div className="wine-item" key={wine._id}>
            <div className="wine-info">
              <h3>{wine.name}</h3>
              <p>{wine.type}</p>
              <p>${wine.price}</p>
              <p>Winery: {wine.winery ? wine.winery.name : "Unknown Winery"}</p>
              <button onClick={() => addToCart(wine)}>Add to Cart</button>
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
              <button
                onClick={() => handleDelete(wine._id)}
                className="delete-button"
              >
                Delete Wine
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinePage;
