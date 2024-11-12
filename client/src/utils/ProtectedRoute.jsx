import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { CustomSpinner } from "../components/index";

function ProtectedRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <CustomSpinner />;
  }

  if (!isAuthenticated || !user) {
    if (
      window.location.pathname.startsWith("/user") ||
      window.location.pathname.startsWith("/admin")
    ) {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  if (isAuthenticated && user.role === "admin") {
    if (window.location.pathname.startsWith("/admin")) {
      return <Outlet />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  if (
    (isAuthenticated && user.role === "customer") ||
    user.role === "professional"
  ) {
    if (window.location.pathname.startsWith("/user")) {
      return <Outlet />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Navigate to="/" replace />;
}

export default ProtectedRoute;
