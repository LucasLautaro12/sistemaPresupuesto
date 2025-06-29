import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { fetchProfile } from "../../api/fetchProfile";
import { handleLogout as apiLogout} from "../../api/logout";
import { AuthContext } from "../../auth/AuthContext";


const Header: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const { logout: contextLogout } = useContext(AuthContext);

  useEffect(() => {
    fetchProfile(setUserName, () => apiLogout(navigate));
  }, [navigate]);

  const handleCerrarSesion = async () => {
    await apiLogout(navigate); // Cierra sesiÃ³n en el backend y remueve el token
    contextLogout(); // Limpia los permisos en el AuthContext
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <div className="header">
      <img
        src="/LogoSinFondo (2).png"
        alt="Logo Vexar"
        className="header-logo"
        onClick={handleLogoClick}
      />
      <div className="header-actions">
        <div className="user-circle">{userName || "Usuario"}</div>
        <button className="logout-btn" onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Header;

