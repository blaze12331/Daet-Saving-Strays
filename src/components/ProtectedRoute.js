import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../config/AuthProvider"; // Custom hook to get auth state

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // If the user is not logged in, redirect to the login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Render the children (protected page) if the user is authenticated
  return children;
};

export default ProtectedRoute;
