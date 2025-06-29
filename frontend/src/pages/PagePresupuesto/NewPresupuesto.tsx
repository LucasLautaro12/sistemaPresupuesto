import React, { useState } from "react";
import Header from "../../core/components/Header";
import Sidebar from "../../core/components/Sidebar";
import FormCliente from "../../core/components/CreatePresupuesto/FormCliente/FormCliente";
import FormAbertura from "../../core/components/CreatePresupuesto/FormAbertura/FormAbertura";
import FormPresupuesto from "../../core/components/CreatePresupuesto/FormPresupuesto/FormPresupuesto";
import { FormDataProvider } from "../../core/components/CreatePresupuesto/context/FormDataContextP";
import { useNavigate } from "react-router-dom";
import { fetchPresupuestos } from "../../api/fetchPresupuestos";


const NewPresupuesto: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<"cliente" | "abertura" | "presupuesto">("cliente");
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Cierre de sesiÃ³n ejecutado");
  };

  const handleNext = () => {
    if (currentForm === "cliente") setCurrentForm("abertura");
    else if (currentForm === "abertura") setCurrentForm("presupuesto");
  };

  const handleBack = () => {
    if (currentForm === "abertura") setCurrentForm("cliente");
    else if (currentForm === "presupuesto") setCurrentForm("abertura");
  };

  // 🔹 Función para guardar y redirigir a la tabla de presupuestos
  const handleSaveAndRedirect = () => {
    navigate("/presupuestos"); // Redirigir a la tabla de presupuestos
    window.location.reload();
  };

  return (
    
    <div className="new-presupuesto-page">
    <img src="/Fondo.png" alt="Fondo" className="background-image" />
    <Header onLogout={handleLogout} />
    <div className="usuario-container">
      <Sidebar isOpen={false} userPermissions={[]} />
      <div className="form-container">
      <FormDataProvider>
      <div className="usuario-table-container">
        {currentForm === "cliente" && <FormCliente onNext={handleNext} />}
        {currentForm === "abertura" && <FormAbertura onNext={handleNext} onBack={handleBack} />}
        {currentForm === "presupuesto" && <FormPresupuesto onBack={handleBack} onSave={handleSaveAndRedirect}/>}
          </div>
        </FormDataProvider>
        </div>
      </div>
      </div>
      
  );
};

export default NewPresupuesto;
