import React, { useContext, useState } from "react";
import Header from "../../core/components/Header";
import Sidebar from "../../core/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import TablaPres from "../../core/components/TablaPresupuesto/TablaPres";


const ListaPresupuesto: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { permisos } = useContext(AuthContext);
    
 const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
};

const handleLogout = () => {
    console.log("Cierre de sesiÃ³n ejecutado");
};

const navigate = useNavigate();
const handleAddButtonClick = () => {
  navigate("/formpresupuesto"); 
};
  
    return (
      <div className="usuario-page">
                <img src="/Fondo.png" alt="Fondo" className="background-image" />
                <Header onLogout={handleLogout} />
                
         <div className="usuario-container">
         {<Sidebar isOpen={false} userPermissions={[]} />}
        
          {/* Mostrar permisos para depurar */}
      {/* <pre>{JSON.stringify(permisos, null, 2)}</pre> */}
      {(permisos.includes("CREAR_PRES") || permisos.includes("ADMIN")) && (
        <button className="add-button" onClick={handleAddButtonClick}>
          +
        </button>
      )}

                <div className="usuario-table-container">
                <TablaPres />
                </div>
        </div> 
      </div>
    );
  };
  
  export default ListaPresupuesto;
  