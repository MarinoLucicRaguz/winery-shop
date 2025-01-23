import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

const AdminRoute = () => {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default AdminRoute;
