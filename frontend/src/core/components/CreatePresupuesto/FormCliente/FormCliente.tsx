import React, { useState } from "react";
import FormLayoutPresupuesto from "../FormLayoutPresupuesto";
import "./FormCliente.css";
import { useNavigate } from "react-router-dom";
import Input from "../Input";
import { useFormContext} from "../context/FormDataContextP";

interface FormClienteProps {
  onNext: (formData: { apellido: string; nombre: string; telefono: string; ubicacion: string }) => void;
}

const FormCliente: React.FC<FormClienteProps> = ({ onNext }) => {
  const { formData, updateFormData } = useFormContext();
  const [formValues, setFormValues] = useState({
    apellido: "",
    nombre: "",
    telefono: "",
    ubicacion: "",
  });


  const handleInputChange = (field: string, value: string) => {
    // Primero actualizamos el estado local
    console.log(`Campo: ${field}, Valor: ${value}`); // Agregado para verificar si se ejecuta
    setFormValues((prev) => {
      const updatedValues = { ...prev, [field]: value };
      
      // Luego actualizamos el contexto con los datos más actualizados
      updateFormData("cliente", updatedValues); // Cambiar 'cliente' por el nombre del formulario correspondiente
      
      return updatedValues;
    });
  };
  
  

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(-1); // Navega hacia la página anterior
  };

  const handleNext = () => {
    if (!formValues.apellido && !formValues.nombre) {
      alert("Debe completar al menos el Nombre o el Apellido.");
      return;
    }
    if (!formValues.telefono) {
      alert("El campo Teléfono es obligatorio.");
      return;
    }
    onNext(formValues);
  };

  return (
    <FormLayoutPresupuesto 
      subtitle="Datos del Cliente"
      top="200px"
      buttons={
        <div className="form-buttons2">
          <button className="back-button" onClick={handleCancel}>
            Volver
          </button>
          <button className="next-button" onClick={handleNext}>
            Siguiente
          </button>
        </div>
      }
    >
      <form className="cliente-form-grid">
        <Input
          label="Apellido"
          value={formValues.apellido}
          onChange={(value) => handleInputChange("apellido", value)}
        />
        <Input
          label="Nombre"
          value={formValues.nombre}
          onChange={(value) => handleInputChange("nombre", value)}
        />
        <Input
          label="Teléfono"
          value={formValues.telefono}
          onChange={(value) => handleInputChange("telefono", value)}
          type="tel"
        />
        <Input
          label="Ubicación"
          value={formValues.ubicacion}
          onChange={(value) => handleInputChange("ubicacion", value)}
        />
      </form>
    </FormLayoutPresupuesto>
  );
};

export default FormCliente;
