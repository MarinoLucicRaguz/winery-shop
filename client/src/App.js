import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import "./App.css";
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
import FavoritesPage from "./pages/FavoritesPage";
import { getUserFromToken } from "./utils/auth";
import AdminRoute from "./components/AdminRoute";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getUserFromToken();
    setCurrentUser(user);
  }, []);

  return (
    <CartProvider>
      <Router>
        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <div className="page-content">
          <Routes>
            <Route
              path="/login"
              element={
                <RedirectMiddleware>
                  <Login setCurrentUser={setCurrentUser} />
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
            <Route element={<PrivateRoute currentUser={currentUser} />}>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wines" element={<WinePage />} />
              <Route path="/wines/:id" element={<WineDetails />} />
              <Route path="/wineries" element={<WineryPage />} />
              <Route path="/wineries/:id" element={<WineryDetails />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route element={<AdminRoute currentUser={currentUser} />}>
                <Route path="/wines/add" element={<WineForm />} />
                <Route path="/wineries/add" element={<WineryForm />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
