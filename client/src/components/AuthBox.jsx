import React from "react";
import "./AuthBox.css";

const AuthBox = ({ children }) => {
  return (
    <div className="auth-box-container">
      <div className="auth-box">{children}</div>
    </div>
  );
};

export default AuthBox;
