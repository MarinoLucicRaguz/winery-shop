import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

const PrivateRoute = () => {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
