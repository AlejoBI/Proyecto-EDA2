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

  // Si no está autenticado, permitir el acceso a las rutas públicas.
  return <Outlet />;
}

export default PublicRoute;
