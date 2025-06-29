import React, { useState } from "react";
import Header from "../../core/components/Header";
import Sidebar from "../../core/components/Sidebar";
import TablaTK from "../../core/components/TablaTK";


const ListaTK: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
 const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
};

const handleLogout = () => {
    console.log("Cierre de sesiÃ³n ejecutado");
};

    return (
      <div className="usuario-page">
                <img src="/Fondo.png" alt="Fondo" className="background-image" />
                <Header onLogout={handleLogout} />
                
         <div className="usuario-container">
         {<Sidebar isOpen={false} userPermissions={[]} />}

                <div className="usuario-table-container">
                <TablaTK />
                </div>
        </div> 
      </div>
    );
  };
  
  export default ListaTK;
  