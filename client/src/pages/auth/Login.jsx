import React, { useState } from "react";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import AuthBox from "../../components/AuthBox";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      login({
        id: response.data.id,
        username: response.data.username,
        role: response.data.role,
      });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <AuthBox>
      <h2>Login</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
        <button onClick={handleGoToRegister}>Go to register</button>
      </div>
    </AuthBox>
  );
};

export default Login;
