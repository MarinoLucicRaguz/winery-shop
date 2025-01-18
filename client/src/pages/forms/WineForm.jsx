import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import "./WineForm.css";

const WineForm = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [grapeVariety, setGrapeVariety] = useState("");
  const [alcoholContent, setAlcoholContent] = useState("");
  const [vintage, setVintage] = useState("");
  const [price, setPrice] = useState("");
  const [winery, setWinery] = useState("");
  const [description, setDescription] = useState("");
  const [wineries, setWineries] = useState([]);
  const [error, setError] = useState("");
  const [detailedErrors, setDetailedErrors] = useState([]);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch wineries when the component mounts
  useEffect(() => {
    const fetchWineries = async () => {
      try {
        const response = await axiosInstance.get("/wineries");
        setWineries(response.data); // Set the wineries in state
      } catch (err) {
        setError("Failed to fetch wineries.");
      }
    };

    fetchWineries();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error states
    setError("");
    setDetailedErrors([]);

    // Validation logic
    const validationErrors = [];

    if (!name.trim()) {
      validationErrors.push("Wine name is required.");
    }
    if (!type) {
      validationErrors.push("Wine type is required.");
    }
    if (alcoholContent === "" || alcoholContent < 0 || alcoholContent > 100) {
      validationErrors.push("Alcohol content must be between 0 and 100.");
    }
    if (!vintage || vintage < 1000 || vintage > new Date().getFullYear()) {
      validationErrors.push(
        `Year must be between 1000 and ${new Date().getFullYear()}.`
      );
    }
    if (price === "" || price < 0) {
      validationErrors.push("Price must be 0 or higher.");
    }
    if (!winery) {
      validationErrors.push("Please select a winery.");
    }
    if (!description.trim()) {
      validationErrors.push("Description is required.");
    }
    if (description.length > 1000) {
      validationErrors.push("Description must be 1000 characters or fewer.");
    }

    // If there are validation errors, stop submission
    if (validationErrors.length > 0) {
      setDetailedErrors(validationErrors);
      return;
    }

    // Proceed with submission if validation passes
    try {
      const response = await axiosInstance.post("/wine", {
        name,
        type,
        grapeVariety,
        alcoholContent,
        vintage,
        price,
        winery,
        description,
      });

      setSuccess("Wine added successfully!");
      setError("");
      setDetailedErrors([]); // Clear previous errors

      // Optionally, redirect to another page
      setTimeout(() => navigate("/wines"), 2000);
    } catch (err) {
      setSuccess("");

      // Parse detailed validation errors from backend if available
      if (err.response?.data?.errors) {
        const serverValidationErrors = Object.values(
          err.response.data.errors
        ).map((error) => error.message);
        setDetailedErrors(serverValidationErrors);
      } else {
        setError(err.response?.data?.message || "Failed to add wine.");
        setDetailedErrors([]); // Clear detailed errors
      }
    }
  };

  return (
    <div className="wine-form-container">
      <h2>Add Wine</h2>
      <form className="wine-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Wine Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="Red">Red</option>
            <option value="White">White</option>
            <option value="Rose">Rose</option>
            <option value="Sparkling">Sparkling</option>
          </select>
        </div>
        <div className="form-group">
          <label>Grape Variety:</label>
          <input
            type="text"
            value={grapeVariety}
            onChange={(e) => setGrapeVariety(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Alcohol Content (%):</label>
          <input
            type="number"
            value={alcoholContent}
            onChange={(e) => setAlcoholContent(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Vintage (Year):</label>
          <input
            type="number"
            value={vintage}
            onChange={(e) => setVintage(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Winery:</label>
          <select
            value={winery}
            onChange={(e) => setWinery(e.target.value)}
            required
          >
            <option value="">Select Winery</option>
            {wineries.map((wineryItem) => (
              <option key={wineryItem._id} value={wineryItem._id}>
                {wineryItem.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Add Wine
        </button>
      </form>

      {/* Error Messages */}
      {error && <div className="form-error">{error}</div>}

      {/* Detailed Validation Errors */}
      {detailedErrors.length > 0 && (
        <ul className="form-detailed-errors">
          {detailedErrors.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      )}

      {/* Success Message */}
      {success && <div className="form-success">{success}</div>}
    </div>
  );
};

export default WineForm;
