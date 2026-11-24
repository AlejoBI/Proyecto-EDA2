import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

import { CustomSpinner } from "../components/index";

function ProtectedRoute() {
  const { user, isAuthenticated, loading, authStatus } = useAuth();

  if (authStatus === "unavailable") {
    return (
      <p role="alert">
        Authentication is unavailable. Private pages cannot be opened right now.
      </p>
    );
  }

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
