import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = ({ currentUser }) => {
  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default AdminRoute;
