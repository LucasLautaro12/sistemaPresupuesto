import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../../FormLayout/FormLayout";
import ProgressBar from "../../ProgressBar/ProgressBar";
import SubmitButtons from "../../SubmitButtons/SubmitButtons";
import DepartmentOption from "./DepartmentOption";
import { useFormData } from "../../context/FormDataContext"; // Importa el contexto
import "./FormDepartments.css";

// Definir las opciones de departamentos
const departments = [
  { id: "comercial", label: "COMERCIAL", icon: "handshake-icon" },
  { id: "producto", label: "PRODUCTO", icon: "product-icon" },
  { id: "compras", label: "COMPRAS", icon: "cart-icon" },
  { id: "produccion", label: "PRODUCCION", icon: "factory-icon" },
  { id: "instalacion", label: "INSTALACION", icon: "installation-icon" },
  { id: "administracion", label: "ADMINISTRACION", icon: "admin-icon" },
  { id: "almacen", label: "ALMACEN", icon: "almacen-icon" },
];

const FormDepartments: React.FC = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormData(); // Usamos el contexto para acceder y actualizar los datos
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(formData.department || null);

  // Función para manejar la selección del departamento
  const handleSelect = (id: string) => {
    setSelectedDepartment(id);
    updateFormData({ department: id }); // Actualizamos el departamento en el contexto
  };

  // Función para ir atrás
  const handleBack = () => {
    navigate("/createuser"); // Ruta de retroceso
  };

  // Función para avanzar a la siguiente pantalla
  const handleNext = () => {
    if (selectedDepartment) {
      console.log("Departamento seleccionado:", selectedDepartment);
      navigate(`/roleform/${selectedDepartment}`); // Navegar a la ruta dinámica
    } else {
      alert("Por favor, selecciona un departamento");
    }
  };

  return (
    <FormLayout
      title="Nuevo Usuario"
      progressBar={<ProgressBar currentStep={2} />}
      subtitle="Elegí el departamento al que pertenece"
      buttons={<SubmitButtons onBack={handleBack} onNext={handleNext} />}
    >
      <div className="department-options-container">
        <div className="department-options">
          {departments.map((dept) => (
            <DepartmentOption
              key={dept.id}
              id={dept.id}
              label={dept.label}
              icon={dept.icon}
              isSelected={selectedDepartment === dept.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </FormLayout>
  );
};

export default FormDepartments;
