import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";
import "./Home.css";

const Home = () => {
  const [wines, setWines] = useState([]);
  const [wineries, setWineries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({ type: "", price: "", wineryId: "" });
  const [sort, setSort] = useState("name");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const winesResponse = await axiosInstance.get("/wine");
        setWines(winesResponse.data || []);
      } catch (err) {
        console.error("Error fetching wines", err);
        setWines([]);
      }

      try {
        const wineriesResponse = await axiosInstance.get("/wineries");
        setWineries(wineriesResponse.data || []);
      } catch (err) {
        console.error("Error fetching wineries", err);
        setWineries([]);
      }

      try {
        const reviewsResponse = await axiosInstance.get("/reviews");
        setReviews(reviewsResponse.data || []);
      } catch (err) {
        console.error("Error fetching reviews", err);
        setReviews([]);
      }
    };

    fetchData();
  }, []);

  const winesWithDetails = wines.map((wine) => {
    return {
      ...wine,
      reviews: reviews.filter((review) => review.wine === wine._id),
    };
  });

  const filteredWines = winesWithDetails.filter((wine) => {
    let isValid = true;

    if (filters.type && wine.type !== filters.type) {
      isValid = false;
    }

    if (
      filters.price &&
      Number(filters.price) > 0 &&
      wine.price > Number(filters.price)
    ) {
      isValid = false;
    }

    if (
      filters.wineryId &&
      wine?.winery?._id !== filters.wineryId
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
    if (sort === "rating") {
      const avgA =
        a.reviews.reduce((sum, review) => sum + review.rating, 0) /
          (a.reviews.length || 1);
      const avgB =
        b.reviews.reduce((sum, review) => sum + review.rating, 0) /
          (b.reviews.length || 1);
      return avgB - avgA;
    }
    return 0;
  });

  const groupedWines = wineries.map((winery) => ({
    winery,
    wines: sortedWines.filter(
      (wine) => wine?.winery?._id === winery._id
    ),
  }));

  return (
    <div>
      <div className="filters-home">
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
          <select onChange={(e) => setSort(e.target.value)} value={sort}>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="rating">Average Rating</option>
          </select>
        </label>
      </div>

      <div className="wineries-home">
        {groupedWines.map((group) => (
          <div key={group.winery._id} className="winery-group-home">
            <h2 className="winery-name-home">{group.winery.name}</h2>
            <p className="winery-details-home">
              {group.winery.country}, {group.winery.city}
            </p>
            <div className="wine-list-home">
              {group.wines.length > 0 ? (
                group.wines.map((wine) => (
                  <div key={wine._id} className="wine-item-home">
                    <h4>{wine.name}</h4>
                    <p>Type: {wine.type}</p>
                    <p>Price: {wine.price}€</p>
                    <p>Reviews: {wine.reviews.length}</p>
                    <div className="wine-reviews-home">
                      {wine.reviews.length > 0 ? (
                        <p>
                          <strong>Average review: </strong>
                          {(
                            wine.reviews.reduce((sum, review) => sum + review.rating, 0) /
                            wine.reviews.length
                          ).toFixed(2)}
                          /5
                        </p>
                      ) : (
                        <p>No reviews yet.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No wines available for this winery.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
