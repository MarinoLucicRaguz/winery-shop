import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios"; // Axios instance
import { useParams } from "react-router-dom"; // useParams to get winery ID from URL
import "./WineryDetails.css";

const WineryDetails = () => {
  const { id } = useParams(); // Get winery ID from the URL
  const [winery, setWinery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch winery details based on the winery ID
  useEffect(() => {
    const fetchWineryDetails = async () => {
      try {
        const response = await axiosInstance.get(`/wineries/${id}`);
        setWinery(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load winery details.");
        setLoading(false);
      }
    };

    fetchWineryDetails();
  }, [id]); // Dependency on winery ID

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="winery-details">
      {winery && (
        <>
          <h1>{winery.name}</h1>
          <p>
            <strong>Founding Year:</strong> {winery.foundingYear}
          </p>
          <p>
            <strong>Country:</strong> {winery.country}
          </p>
          <p>
            <strong>City:</strong> {winery.city}
          </p>
          <p>
            <strong>Description:</strong> {winery.description}
          </p>
          <div className="winery-logo">
            <img
              src={winery.logoUrl || "/default-logo.jpg"}
              alt={winery.name}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WineryDetails;
