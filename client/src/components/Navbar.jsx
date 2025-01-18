import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, user, logout }) => {
  return (
    isAuthenticated && (
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/wines">Wines</Link>
        <Link to="/wineries">Wineries</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">My Orders</Link>
        <button onClick={logout}>Logout</button>
      </nav>
    )
  );
};

export default Navbar;
