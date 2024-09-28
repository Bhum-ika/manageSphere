import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.js";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  return token ? (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/loginUser" />
  );
};

export default PrivateRoute;
