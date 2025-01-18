import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import axiosInstance from "../../axios";

const Dashboard = ({ isAdmin }) => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axiosInstance.get("/wineries");
      console.log(response);
      // const data = await response.json();
      // setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
  };

  return (
    <div className="dashboard">
      <h2>Product Dashboard</h2>
      {isAdmin && <button>Add New Product</button>}
      <div className="products">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <button onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
