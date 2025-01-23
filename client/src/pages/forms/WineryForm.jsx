import React, { useState } from "react";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import "./WineryForm.css";

const WineryForm = () => {
  const [name, setName] = useState("");
  const [foundingYear, setFoundingYear] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/wineries", {
        name,
        foundingYear,
        country,
        city,
        description,
        logoUrl,
      });

      setSuccess("Winery added successfully!");
      setError("");
      setTimeout(() => navigate("/wineries"), 2000);
    } catch (err) {
      setSuccess("");
      setError(err.response?.data?.message);
    }
  };

  return (
    <div className="winery-form-container">
      <h2>Add Winery</h2>
      <form className="winery-form" onSubmit={handleSubmit}>
        <div>
          <label>Winery Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Founding Year:</label>
          <input
            type="number"
            value={foundingYear}
            onChange={(e) => setFoundingYear(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Logo URL:</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>
        <button type="submit">Add Winery</button>
      </form>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

export default WineryForm;
