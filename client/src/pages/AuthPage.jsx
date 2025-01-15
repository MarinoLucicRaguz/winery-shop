import React, { useState } from "react";
import AuthBox from "../components/AuthBox";
import Login from "./auth/Login";
import Register from "./auth/Register";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  return (
    <AuthBox>
      {isLogin ? (
        <Login setError={setError} />
      ) : (
        <Register setError={setError} />
      )}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to register" : "Switch to login"}
      </button>
      {error && <p>{error}</p>}
    </AuthBox>
  );
};

export default AuthPage;
