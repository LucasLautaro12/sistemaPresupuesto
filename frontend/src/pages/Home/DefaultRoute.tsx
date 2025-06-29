// DefaultRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';

const DefaultRoute = () => {
  const { permisos } = useContext(AuthContext);

  const menuItems = [
    { name: "Usuarios", permissions: ["ADMIN"], path: "/usuario" },
    { name: "Presupuestos", permissions: ["LEER_PM_PRES", "ADMIN"], path: "/presupuestos" },
    { name: "TKs", permissions: ["LEER_PM_TK", "ADMIN"], path: "/tks" },
  ];

  // Si el usuario es ADMIN, se muestran todos; si no, se filtran
  const filteredItems = permisos.includes("ADMIN")
    ? menuItems
    : menuItems.filter(item =>
        item.permissions.some(perm => permisos.includes(perm))
      );

  // Si no hay rutas disponibles, redirige a login o a un mensaje de error
  if (filteredItems.length === 0) {
    return <Navigate to="/login" />;
  }

  // Redirige al primer ítem permitido
  return <Navigate to={filteredItems[0].path} />;
};

export default DefaultRoute;
