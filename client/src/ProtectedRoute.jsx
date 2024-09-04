import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import CustomSpinner from "./components/CustomSpinner";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // Agrega una lógica para manejar la carga inicial mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return <CustomSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
