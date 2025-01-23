import React, { useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken, logout } from "../utils/auth";

const Navbar = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      const user = getUserFromToken();
      setCurrentUser(user);
    }
  }, [currentUser, setCurrentUser]);

  const handleLogoutClick = () => {
    logout();
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <>
      {currentUser && (
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/wines">Wines</Link>
          <Link to="/wineries">Wineries</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/favorites">My Favorites</Link>
          <button onClick={handleLogoutClick} className="logout-button">
            Logout
          </button>
        </nav>
      )}
    </>
  );
};

export default Navbar;
