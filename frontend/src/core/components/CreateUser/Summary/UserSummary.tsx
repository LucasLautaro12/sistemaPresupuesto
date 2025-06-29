import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserSummary.css"; // Archivo CSS para estilos personalizados
import { useFormData } from "../context/FormDataContext"; // Usamos el contexto para acceder a los datos
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import { handleSubmit } from "../../../../api/handleSubmit";

const UserSummary: React.FC = () => {
  const { formData, updateFormData } = useFormData(); // Incluye la función para actualizar datos en el contexto
  const navigate = useNavigate();

  // Usar la función handleSubmit importada
  const submitHandler = () => {
    handleSubmit(formData, updateFormData, navigate); // Pasar navigate como parámetro

    navigate("/usuario");
    
  };

  return (
    <div className="usuario-page">
      <img src="/Fondo.png" alt="Fondo" className="background-image" />
      <Header onLogout={() => console.log("Cierre de sesión ejecutado")} />

      <div className="usuario-container">
        <Sidebar isOpen={false} userPermissions={[]} />
        
        <div className="user-summary-container">
          <h1>Nuevo Usuario Creado</h1>
          <hr />
          <div className="user-summary-details">
            <p>
              <strong>Nombre:</strong> {formData.user.nombre}
            </p>
            <p>
              <strong>Apellido:</strong> {formData.user.apellido}
            </p>
            <p>
              <strong>DNI:</strong> {formData.user.dni}
            </p>
            <p>
              <strong>Correo:</strong> {formData.user.correo}
            </p>
            <p>
              <strong>Departamento:</strong> {formData.department}
            </p>
            <p>
              <strong>Rol:</strong> {formData.roles}
            </p>
            <p>
              <strong>Permisos:</strong>{" "}
              {formData.permissions && formData.permissions.length > 0
                ? "Todos"
                : "Sin permisos asignados"}
            </p>
          </div>
          <hr />
          <button className="submit-button" onClick={submitHandler}>
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSummary;
