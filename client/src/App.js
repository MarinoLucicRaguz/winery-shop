import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Cart from "./components/Cart";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RedirectMiddleware from "./components/RedirectAuthMiddleware";
import Home from "./pages/Home";
import WineForm from "./pages/forms/WineForm";
import WineryForm from "./pages/forms/WineryForm";
import WinePage from "./pages/WinePage";
import WineDetails from "./pages/details/WineDetails";
import WineryPage from "./pages/WineryPage";
import WineryDetails from "./pages/details/WineryDetails";
import Orders from "./pages/Orders";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setUser({});
    localStorage.removeItem("token");
  };

  return (
    <CartProvider>
      <Router>
        <Navbar isAuthenticated={isAuthenticated} user={user} logout={logout} />
        <div className="page-content">
          <Routes>
            <Route
              path="/login"
              element={
                <RedirectMiddleware>
                  <Login
                    setIsAuthenticated={setIsAuthenticated}
                    setUser={setUser}
                  />
                </RedirectMiddleware>
              }
            />
            <Route
              path="/register"
              element={
                <RedirectMiddleware>
                  <Register />
                </RedirectMiddleware>
              }
            />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wines/add" element={<WineForm />} />
              <Route path="/wines" element={<WinePage />} />
              <Route path="/wines/:id" element={<WineDetails />} />
              <Route path="/wineries" element={<WineryPage />} />
              <Route path="/wineries/add" element={<WineryForm />} />
              <Route path="/wineries/:id" element={<WineryDetails />} />
              <Route path="/orders" element={<Orders />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
