import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ No user → go to Login page ("/")
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role mismatch → go to Login page
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;
