import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  requiredPermissions?: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  requiredPermissions,
  children,
}) => {
  const { permisos } = useContext(AuthContext);

  console.log("isAuthenticated en ProtectedRoute:", isAuthenticated);
  console.log("Permisos del usuario:", permisos);

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    console.log("No autenticado, redirigiendo al login.");
    return <Navigate to="/" replace />;
  }

  // Si se especificaron permisos requeridos, verificar que el usuario tenga al menos uno
  if (requiredPermissions && requiredPermissions.length > 0) {
    const tienePermiso = requiredPermissions.some((permiso) =>
      permisos.includes(permiso)
    );
    if (!tienePermiso) {
      return <div>Acceso denegado: No tienes los permisos necesarios.</div>;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
