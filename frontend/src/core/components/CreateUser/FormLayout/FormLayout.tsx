import React, { useState } from "react";
import "./FormLayout.css";
import Header from "../../Header";
import Sidebar from "../../Sidebar";

interface FormLayoutProps {
  title: string;
  subtitle?: string;
  progressBar: React.ReactNode;
  buttons: React.ReactNode;
  children: React.ReactNode;
}

const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  subtitle,
  progressBar,
  buttons,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const userPermissions = ["viewUsers", "viewReports"];

  const handleLogout = () => {
    console.log("Cierre de sesiÃ³n ejecutado");
    // AquÃ­ puedes agregar lÃ³gica para redirigir o limpiar el estado
  };

  return (
    <div className="usuario-page">
      <img 
        src="/Fondo.png"
        alt="Fondo"
        className="background-image"
      />
      <Header />
      <div className="usuario-container">
        {
          <Sidebar
            isOpen={isSidebarOpen}
            userPermissions={userPermissions}
            onToggle={toggleSidebar} // Pasa la función toggle como prop
          />
        }
        <div className="usuario-table-container">
          <div className="form-layout">
            <div className="form-header">
              <h2>{title}</h2>
              {progressBar}
              {subtitle && <h3 className="subtitle">{subtitle}</h3>}
            </div>
            {children}
            {buttons}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
