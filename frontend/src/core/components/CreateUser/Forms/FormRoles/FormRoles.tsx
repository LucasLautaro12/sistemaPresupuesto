import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormLayout from "../../FormLayout/FormLayout";
import ProgressBar from "../../ProgressBar/ProgressBar";
import SubmitButtons from "../../SubmitButtons/SubmitButtons";
import { useFormData } from "../../context/FormDataContext";
import RolesOption from "./RolesOption";
import './FormRoles.css';

// Definir los roles según el departamento seleccionado
const departmentRoles: { [key: string]: { role: string, image: string }[] } = {
  comercial: [
    { role: "Vendedor", image: "comercial-vendedor-icon" },
    { role: "Gerente Comercial", image: "comercial-jefe-comercial-icon" },
    { role: "Atención Cliente", image: "comercial-asistente-icon" }
  ],
  producto: [
    { role: "Gerente Producto", image: "producto-icon" },
    { role: "Encargado Presupuesto", image: "producto-icon" },
    { role: "Presupuestador", image: "producto-icon" }
  ],
  compras: [
    { role: "Comprador", image: "compras-icon" },
    { role: "Asistente de Compras", image: "compras-icon" },
    { role: "Gerente de Compras", image: "compras-icon" }
  ],
  produccion: [
    { role: "Gerente Operaciones", image: "produccion-icon" },
    { role: "Sector Medición", image: "produccion-icon" },
    { role: "Sector Mantenimiento", image: "produccion-icon" },
    { role: "Gerente Fábrica", image: "produccion-icon" },
    { role: "Órdenes Producción", image: "produccion-icon" },
  ],
  instalacion: [
    { role: "Gerente Instalación", image: "instalacion-icon" },
    { role: "Instalador", image: "instalacion-icon" },
    { role: "Instalador", image: "instalacion-icon" }
  ],
  administracion: [
    { role: "Gerente Administración", image: "administracion-icon" },
    { role: "Sector Contable", image: "administracion-icon" },
    { role: "Control Comercial", image: "administracion-icon" }
  ],
  almacen: [
    { role: "Gerente Almacén", image: "administracion-icon" },
    { role: "Sector Pañol", image: "administracion-icon" },
    { role: "Instalador", image: "instalacion-icon" }
  ],
};

const FormRoles: React.FC = () => {
  const { department } = useParams(); // Obtiene el departamento desde la URL
  const [roles, setRoles] = useState<{ role: string, image: string }[]>([]);
  const { formData, updateFormData } = useFormData(); // Usamos el contexto para acceder y actualizar los datos
  const [selectedRole, setSelectedRole] = useState<string[]>(formData.roles || []); // Ahora es un array de strings
  const navigate = useNavigate(); // Usamos useNavigate para la redirección

  useEffect(() => {
    if (department && departmentRoles[department]) {
      setRoles(departmentRoles[department]); // Actualiza los roles según el departamento seleccionado
    } else {
      setRoles([]); // Si no hay roles disponibles, mostrar mensaje
    }
  }, [department]);

  // Función para ir atrás
  const handleBack = () => {
    navigate(`/departamentform`);
  };

  const handleSelectRole = (role: string) => {
    // Si el rol ya está en la lista, lo quitamos; si no, lo agregamos
    const updatedRoles = selectedRole.includes(role)
      ? selectedRole.filter((r) => r !== role) // Elimina el rol si ya existe
      : [...selectedRole, role]; // Agrega el rol si no existe

    setSelectedRole(updatedRoles); // Actualiza el estado local con la lista de roles
    updateFormData({ roles: updatedRoles }); // Actualiza el contexto con la lista de roles
  };

  const handleNext = () => {
    if (selectedRole.length > 0) { // Verifica si hay al menos un rol seleccionado
      // Navegamos a la siguiente página, pasando el primer rol seleccionado
      navigate(`/permissionsform/${department}/${selectedRole[0]}`);
    } else {
      alert("Por favor, selecciona al menos un rol");
    }
  };

  return (
    <FormLayout
      title="Nuevo Usuario"
      progressBar={<ProgressBar currentStep={3} />}
      subtitle={`Departamento: ${department}`}
      buttons={<SubmitButtons onBack={handleBack} onNext={handleNext} />}
    >
      <div className="roles-options">
        {roles.length > 0 ? (
          roles.map(({ role, image }) => (
            <RolesOption
              key={role}
              role={role}
              image={image}
              isSelected={selectedRole.includes(role)} // Verifica si el rol está seleccionado
              onSelect={() => handleSelectRole(role)}
            />
          ))
        ) : (
          <p>No hay roles disponibles para este departamento</p>
        )}
      </div>
    </FormLayout>
  );
};

export default FormRoles;