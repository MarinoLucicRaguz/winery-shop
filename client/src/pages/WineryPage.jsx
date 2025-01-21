import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axios";
import "./WineryPage.css";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";

const WineryPage = () => {
  const [wineries, setWineries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const fetchWineries = async () => {
      try {
        const response = await axiosInstance.get("/wineries");
        setWineries(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load wineries.");
        setLoading(false);
      }
    };

    fetchWineries();
  }, []);

  const handleDelete = async (wineryId) => {
    try {
      const response = await axiosInstance.delete(`/wineries/${wineryId}`);
      setModalMessage(response.data.message);
      setWineries((prevWineries) =>
        prevWineries.filter((winery) => winery._id !== wineryId)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete winery.");
    }
  };

  return (
    <div className="winery-page-container">
      <div className="winery-page-header">
        {modalMessage && (
          <Modal message={modalMessage} onClose={() => setModalMessage("")} />
        )}
        <h1>Our Wineries</h1>
        {isAdmin && (
          <Link to="/wineries/add" className="add-winery-button-winery-page">
            Add New Winery
          </Link>
        )}
      </div>

      {loading && <p>Loading wineries...</p>}
      {error && <p>{error}</p>}

      <div className="winery-page-grid">
        {wineries.map((winery) => (
          <div className="winery-page-item" key={winery._id}>
            <div className="winery-page-info">
              <h3>{winery.name}</h3>
              <p>{winery.country}</p>
              <p>{winery.foundingYear}</p>
            </div>
            <div className="winery-page-buttons">
              <Link
                to={`/wineries/${winery._id}`}
                className="winery-page-details-button"
              >
                View Details
              </Link>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(winery._id)}
                  className="winery-page-delete-button"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WineryPage;
