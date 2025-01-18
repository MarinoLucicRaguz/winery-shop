import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/orders");
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // View details of a specific order
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>
      {loading ? (
        <p className="orders-message">Loading orders...</p>
      ) : error ? (
        <p className="orders-error">{error}</p>
      ) : orders.length === 0 ? (
        <p className="orders-message">No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-summary">
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
              </div>
              <button
                className="view-details-button"
                onClick={() => viewOrderDetails(order)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="order-details">
          <h3>Order Details</h3>
          <p>
            <strong>Order ID:</strong> {selectedOrder._id}
          </p>
          <p>
            <strong>Total Amount:</strong> $
            {selectedOrder.totalAmount.toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {selectedOrder.status}
          </p>
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(selectedOrder.orderDate).toLocaleDateString()}
          </p>
          <h4>Wines:</h4>
          <ul>
            {selectedOrder.wines.map((wineItem) => (
              <li key={wineItem.wine}>
                {wineItem.quantity} x {wineItem.wine.name} @ $
                {wineItem.price.toFixed(2)} each
              </li>
            ))}
          </ul>
          <button
            className="close-details-button"
            onClick={() => setSelectedOrder(null)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
