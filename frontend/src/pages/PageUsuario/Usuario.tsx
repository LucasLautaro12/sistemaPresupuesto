import React, { useState } from "react";
import Header from "../../core/components/Header";
import UsuarioTable from "../../core/components/UsuarioTable";
import Sidebar from "../../core/components/Sidebar";
import { useNavigate } from "react-router-dom";
import "./Usuario.css";

const Usuario: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddButtonClick = () =>{
    navigate("/createuser")
  }
    const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const userPermissions = ['viewUsers', 'viewReports'];

  return (
    <div className="usuario-page">
      <img src="/Fondo.png" alt="Fondo" className="background-image" />
      <Header />

      <div className="usuario-container">
      <Sidebar
                        isOpen={isSidebarOpen}
                        userPermissions={userPermissions}
                        onToggle={toggleSidebar} // Pasa la función toggle como prop
                    />

        {/* Botón redondo */}
        <button className="add-button" onClick={handleAddButtonClick}>+</button>

        <div className="usuario-table-container">
          <UsuarioTable />
        </div>
      </div>
    </div>
  );
};

export default Usuario;
