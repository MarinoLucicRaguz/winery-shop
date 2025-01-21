import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    currentUser && (
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/wines">Wines</Link>
        <Link to="/wineries">Wineries</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">My Orders</Link>
        {currentUser && <Link to="/favorites">My Favorites</Link>}
        <button onClick={handleLogout}>Logout</button>
      </nav>
    )
  );
};

export default Navbar;
