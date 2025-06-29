import React, { useState } from "react";
import FormLayoutPresupuesto from "../FormLayoutPresupuesto";
import Input from "../Input";
import { useFormContext } from "../context/FormDataContextP";
import { crearPresupuesto } from "../../../../api/fetchPresupuestos";

interface FormPresupuestoProps {
  onBack: () => void; // Propiedad para retroceder
  onSave: () => void;
}

const FormPresupuesto: React.FC<FormPresupuestoProps> = ({ onBack, onSave }) => {
  const { formData, updateFormData } = useFormContext();
  const [formValues, setFormValues] = useState({
    urgencia: "No",
    nota: "",
    archivos: [] as File[],
  });
  const [isDragging, setIsDragging] = useState(false); // Estado para indicar arrastre

  const handleInputChange = (field: string, value: string) => {
    console.log(`Campo: ${field}, Valor: ${value}`);
    setFormValues((prev) => {
      const updatedValues = { ...prev, [field]: value };
      // Actualiza el contexto
      updateFormData("presupuesto", updatedValues);
      return updatedValues;
    });
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setFormValues((prev) => ({
        ...prev,
        archivos: [...prev.archivos, ...Array.from(files)], // Concatenar archivos nuevos
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      archivos: prev.archivos.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();

      // Agregar archivos
      formValues.archivos.forEach((file) => {
        formDataToSend.append("archivos", file);
      });

      // Asegurarse de enviar objetos como JSON
      if (formData.cliente) {
        formDataToSend.append("cliente", JSON.stringify(formData.cliente)); // Convertir 'cliente' a JSON
      }

      if (formData.abertura) {
        formDataToSend.append("abertura", JSON.stringify(formData.abertura)); // Convertir 'abertura' a JSON
      }

      if (formData.presupuesto) {
        formDataToSend.append("presupuesto", JSON.stringify(formData.presupuesto));
      } else {
        formDataToSend.append("presupuesto", JSON.stringify({})); // JSON vacío
      }

      crearPresupuesto(formDataToSend)

      alert("Formulario de presupuesto guardado exitosamente.");
      onSave();
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Hubo un error al guardar el formulario.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true); // Activar estado de arrastre
  };

  const handleDragLeave = () => {
    setIsDragging(false); // Desactivar estado de arrastre
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files); // Añadir archivos arrastrados
    }
  };

  return (
    <FormLayoutPresupuesto
      subtitle="Datos del Presupuesto"
      top="234px"
      buttons={
        <div className="form-buttons2">
          <button className="back-button" onClick={onBack}>
            Volver
          </button>
          <button className="save-button" onClick={handleSave}>
            Guardar
          </button>
        </div>
      }
    >
      <form className="form-cliente">
        {/* Campo Urgencia */}
        <Input
          label="¿Es urgente?"
          type="select"
          options={["No", "Si"]}
          value={formValues.urgencia}
          onChange={(value) => handleInputChange("urgencia", value)}
        />

        {/* Campo Nota */}
        <Input
          label="Nota"
          value={formValues.nota}
          onChange={(value) => handleInputChange("nota", value)}
          type="text"
        />

        {/* Campo Archivos */}
        <div
          className={`input-field dropzone ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label htmlFor="archivos">Archivos</label>
          <input
            id="archivos"
            type="file"
            multiple
            onChange={(e) => handleFileChange(e.target.files)}
          />
          <p>
            Arrastra y suelta tus archivos aquí o selecciona desde tu
            dispositivo.
          </p>
          <div className="file-list">
            {formValues.archivos.map((file, index) => (
              <div key={index} className="file-item">
                {file.name}
                <button
                  type="button"
                  className="remove-file-button"
                  onClick={() => handleRemoveFile(index)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </FormLayoutPresupuesto>
  );
};

export default FormPresupuesto;
