import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import axiosInstance from "../axios";
import "./Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, addToCart, decreaseQuantity } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleIncrease = (itemId) => {
    const wineToIncrease = cartItems.find((item) => item._id === itemId);
    if (wineToIncrease) {
      addToCart(wineToIncrease);
    }
  };

  const createOrder = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const orderData = {
      wines: cartItems.map((item) => ({
        wine: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await axiosInstance.post("/orders", orderData);
      setSuccess("Order created successfully!");
      clearCart();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while creating the order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="cart-message">No items in your cart.</p>
      ) : (
        <div className="cart-content">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <h4 className="item-name">{item.name}</h4>
              <p className="item-details">
                {item.quantity} x €{item.price.toFixed(2)}
              </p>
              <div className="quantity-controls">
                <button
                  onClick={() => decreaseQuantity(item._id)}
                  className="decrease-button"
                >
                  -
                </button>
                <button
                  onClick={() => handleIncrease(item._id)}
                  className="increase-button"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h4>Total: €{totalAmount.toFixed(2)}</h4>
            <div className="cart-actions">
              <button onClick={clearCart} className="clear-button">
                Clear Cart
              </button>
              <button
                onClick={createOrder}
                className="order-button"
                disabled={loading}
              >
                {loading ? "Creating Order..." : "Place Order"}
              </button>
            </div>
            {error && <p className="cart-error">{error}</p>}
            {success && <p className="cart-success">{success}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
