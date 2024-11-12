import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { CustomSpinner } from "../components/index";

function PublicRoute() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <CustomSpinner />;
  }

  if (isAuthenticated && user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
