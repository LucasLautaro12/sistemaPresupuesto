// Sidebar.tsx
import React, { useContext, useState } from 'react';
import '../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../auth/AuthContext";

// Ejemplo de permisos asignados al usuario
const userPermissions = ['viewUsers', 'viewReports', 'viewTK'];

interface MenuItem {
    name: string;
    permissions: string[];
    path: string;
  }
  
  const menuItems: MenuItem[] = [
    { name: "Usuarios", permissions: ["ADMIN"], path: "/usuario" },
    {
      name: "Presupuestos",
      permissions: ["LEER_PM_PRES", "ADMIN"],
      path: "/presupuestos",
    },
    { name: "TKs", permissions: ["LEER_PM_TK", "ADMIN"], path: "/tks" },
  ];

// FunciÃ³n para verificar si el usuario puede ver un Ã­tem
function userCanViewItem(
    userPermissions: string[],
    itemPermissions: string[]
  ): boolean {
    // Si el usuario tiene "ADMIN", ve todo
    if (userPermissions.includes("ADMIN")) {
      return true;
    }
    // Sino, revisa si hay al menos un permiso en comÃºn
    return itemPermissions.some((perm) => userPermissions.includes(perm));
  }
  
  // Declaramos el componente como React.FC
  const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();
  
    // Obtenemos los permisos del contexto (asegÃºrate de que AuthContext los exponga como string[])
    const { permisos } = useContext(AuthContext);
  
    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <>
        <div id="menu-toggle-container">
          <button
            className={`menu-toggle ${isOpen ? "open" : ""}`}
            onClick={toggleSidebar}
          >
                <span>☰</span> 
          </button>
        </div>
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <ul>
            {menuItems.map((item) => {
              // Mostramos el Ã­tem si el usuario tiene permiso
              if (userCanViewItem(permisos, item.permissions)) {
                return (
                  <li key={item.name} onClick={() => navigate(item.path)}>
                    {item.name}
                  </li>
                );
              }
              return null;
            })}
          </ul>
          <img
            src="/Camion.png"
            alt="Imagen decorativa"
            className="sidebar-image"
          />
        </div>
      </>
    );
  };
export default Sidebar;