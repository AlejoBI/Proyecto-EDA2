import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { CustomSpinner } from "../components/index";

function ProtectedRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <CustomSpinner />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && user.role === "admin") {
    if (window.location.pathname.startsWith("/admin")) {
      return <Outlet />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  if (isAuthenticated && user.role === "customer" || user.role === "professional") {
    if (window.location.pathname.startsWith("/user")) {
      return <Outlet />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Navigate to="/" replace />;
}

export default ProtectedRoute;
