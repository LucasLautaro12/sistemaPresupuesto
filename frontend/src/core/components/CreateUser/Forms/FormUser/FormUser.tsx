import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormData } from "../../context/FormDataContext"; // Importa el contexto
import FormLayout from "../../FormLayout/FormLayout";
import ProgressBar from "../../ProgressBar/ProgressBar";
import InputField from "../../InputField/InputField";
import SubmitButtons from "../../SubmitButtons/SubmitButtons";
import "./FormUser.css";

const FormUser: React.FC = () => {
  const { updateFormData } = useFormData(); // Para actualizar el contexto
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    correo: "",
    contrasenia1: "",
    contrasenia2: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    correo: "",
    contrasenia1: "",
    contrasenia2: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" })); // Limpiar errores al escribir
  };

  const validateFields = () => {
    const newErrors: typeof errors = {
      nombre: "",
      apellido: "",
      dni: "",
      correo: "",
      contrasenia1: "",
      contrasenia2: "",
    };

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
    if (!/^\d+$/.test(formData.dni) || formData.dni.length < 7)
      newErrors.dni = "El DNI debe ser un número válido con al menos 7 dígitos.";
    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "El correo debe tener un formato válido.";
    }
    if (!formData.contrasenia1)
      newErrors.contrasenia1 = "La contraseña es obligatoria.";
    if (formData.contrasenia1 !== formData.contrasenia2)
      newErrors.contrasenia2 = "Las contraseñas no coinciden.";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleBack = () => {
    navigate("/usuario"); // Cambia esto según la ruta anterior
  };

  const handleNext = () => {
    if (validateFields()) {
      // Actualiza el contexto con los datos del formulario
      updateFormData({
        user: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          dni: formData.dni,
          correo: formData.correo,
          contrasenia1: formData.contrasenia1
        },
      });
      navigate("/departamentform"); // Cambia esto a la ruta del siguiente formulario
    } else {
      console.log("Errores en el formulario:", errors);
    }
  };

  return (
    <FormLayout
      title="Nuevo Usuario"
      progressBar={<ProgressBar currentStep={1} />}
      subtitle="Completa los campos"
      buttons={<SubmitButtons onBack={handleBack} onNext={handleNext} />}
    >
      <div className="form-fields">
        <InputField
          label="Nombre"
          value={formData.nombre}
          onChange={(value) => handleInputChange("nombre", value)}
          error={errors.nombre}
        />
        <InputField
          label="Apellido"
          value={formData.apellido}
          onChange={(value) => handleInputChange("apellido", value)}
          error={errors.apellido}
        />
        <InputField
          label="DNI"
          value={formData.dni}
          onChange={(value) => handleInputChange("dni", value)}
          error={errors.dni}
        />
        <InputField
          label="Correo"
          value={formData.correo}
          onChange={(value) => handleInputChange("correo", value)}
          error={errors.correo}
        />
        <InputField
          label="Contraseña"
          type="password"
          value={formData.contrasenia1}
          onChange={(value) => handleInputChange("contrasenia1", value)}
          error={errors.contrasenia1}
        />
        <InputField
          label="Confirmar Contraseña"
          type="password"
          value={formData.contrasenia2}
          onChange={(value) => handleInputChange("contrasenia2", value)}
          error={errors.contrasenia2}
        />
      </div>
    </FormLayout>
  );
};

export default FormUser;
