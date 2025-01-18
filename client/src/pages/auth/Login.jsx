import React, { useState } from "react";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import AuthBox from "../../components/AuthBox";

const Login = ({ setIsAuthenticated, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      setUser({ username: response.data.username });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response.data.message);
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
