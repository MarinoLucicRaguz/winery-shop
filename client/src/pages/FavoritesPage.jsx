import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./FavoritesPage.css";
import Modal from "../components/Modal";
const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axiosInstance.get(
          `/users/${currentUser.id}/favorites/wines`
        );
        setFavorites(response.data.favorites);
      } catch (err) {
        setError("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const handleRemoveFavorite = async (wineId) => {
    try {
      await axiosInstance.delete(
        `/users/${currentUser.id}/favorites/wines/${wineId}`
      );
      setFavorites((prevFavorites) =>
        prevFavorites.filter((wine) => wine._id !== wineId)
      );
      setModalMessage("Wine removed from favorites.");
    } catch (err) {
      setModalMessage("Failed to remove favorite.");
    }
  };

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="favorites-page-favorites">
      <h1 className="favorites-title-favorites">My Favorite Wines</h1>
      {favorites.length === 0 ? (
        <p>You have no favorite wines yet.</p>
      ) : (
        <div className="favorites-grid-favorites">
          {favorites.map((wine) => (
            <div className="wine-item-favorites" key={wine._id}>
              <h3>{wine.name}</h3>
              <p>Type: {wine.type}</p>
              <p>Price: ${wine.price}</p>
              <p>Winery: {wine.winery ? wine.winery.name : "Unknown Winery"}</p>
              <Link to={`/wines/${wine._id}`}>View Details</Link>
              <button
                onClick={() => handleRemoveFavorite(wine._id)}
                className="remove-button-favorites"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
