import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormLayout from "../../FormLayout/FormLayout";
import ProgressBar from "../../ProgressBar/ProgressBar";
import SubmitButtons from "../../SubmitButtons/SubmitButtons";
import { useFormData } from "../../context/FormDataContext";
import "./FormPermissions.css";

// Mapeo de roles con sus permisos
const rolePermissionsMap: { [key: string]: number[] } = {
  "Vendedor": [5, 6, 7],
  "Gerente Comercial": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "Atención Cliente": [5, 6],
  "Gerente Producto": [1, 2, 3, 5, 6, 7, 8, 9, 10],
  "Encargado Presupuesto": [5, 6, 7, 9],
  "Presupuestador": [5, 6, 7],
  "Comprador": [5, 6, 7],
  "Asistente de Compras": [5, 6],
  "Gerente de Compras": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "Gerente Operaciones": [1, 2, 3, 5, 6, 7, 8, 9, 10],
  "Sector Medición": [5, 6],
  "Sector Mantenimiento": [5, 6],
  "Gerente Fábrica": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "Órdenes Producción": [5, 6, 7],
  "Gerente Instalación": [1, 2, 3, 5, 6, 7, 8, 9, 10],
  "Instalador": [5, 6, 7],
  "Gerente Administración": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "Sector Contable": [5, 6, 7, 9],
  "Control Comercial": [5, 6],
  "Gerente Almacén": [1, 2, 3, 5, 6, 7, 8, 9, 10],
  "Sector Pañol": [5, 6],
};

const permissionsList = [
  { id: 1, name: "Ver Usuarios" },
  { id: 2, name: "Crear Usuarios" },
  { id: 3, name: "Modificar Usuarios" },
  { id: 4, name: "Eliminar Usuarios" },
  { id: 5, name: "Ver PlanMaestro Presupuesto" },
  { id: 6, name: "Ver PlanMaestro Ticket" },
  { id: 7, name: "Crear Presupuesto" },
  { id: 8, name: "Crear Ticket" },
  { id: 9, name: "Modificar Presupuesto" },
  { id: 10, name: "Modificar Ticket" },
];

const FormPermissions: React.FC = () => {
  const { department, role } = useParams();
  const { formData, updateFormData } = useFormData();
  const navigate = useNavigate();

  const availablePermissions = useMemo(() => {
    return role ? permissionsList.filter(p => rolePermissionsMap[role]?.includes(p.id)) : [];
  }, [role]);

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(formData.permissions || []);

  const handleBack = () => {
    navigate(`/roleform/${department}`);
  };

  const handlePermissionChange = (id: number) => {
    setSelectedPermissions((prev) => {
      const updatedPermissions = prev.includes(id)
        ? prev.filter((permissionId) => permissionId !== id)
        : [...prev, id];

      updateFormData({ permissions: updatedPermissions });
      return updatedPermissions;
    });
  };

  const handleNext = () => {
    if (selectedPermissions.length === 0) {
      alert("Por favor, selecciona al menos un permiso");
      return;
    }
    updateFormData({ permissions: selectedPermissions });
    navigate("/usersummary");
  };

  return (
    <FormLayout
      title="Nuevo Usuario"
      progressBar={<ProgressBar currentStep={4} />}
      subtitle="Selecciona los permisos."
      buttons={<SubmitButtons onBack={handleBack} onNext={handleNext} />}
    >
      <div className="permissions-list">
        {availablePermissions.map((permission) => (
          <div key={permission.id} className="permission-option">
            <input
              type="checkbox"
              id={`permission-${permission.id}`}
              checked={selectedPermissions.includes(permission.id)}
              onChange={() => handlePermissionChange(permission.id)}
            />
            <label htmlFor={`permission-${permission.id}`}>{permission.name}</label>
          </div>
        ))}
      </div>
    </FormLayout>
  );
};

export default FormPermissions;