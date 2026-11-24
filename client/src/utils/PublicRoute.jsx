import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

import { CustomSpinner } from "../components/index";

function PublicRoute() {
  const { isAuthenticated, loading, user, authStatus } = useAuth();

  if (authStatus === "unavailable") {
    return <Outlet />;
  }

  if (loading) {
    return <CustomSpinner />;
  }

  if (isAuthenticated && user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
