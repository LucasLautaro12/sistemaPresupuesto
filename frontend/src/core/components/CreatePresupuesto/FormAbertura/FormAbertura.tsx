import React, { useState, useEffect } from "react";
import FormLayoutPresupuesto from "../FormLayoutPresupuesto";
import "./FormAbertura.css";
import Input from "../Input";
import RegistroAberturas from "./TablaRegistro/RegistroAberturas";
import { useFormContext } from "../context/FormDataContextP";
import opcionesLineaColor from "../../../../data/lineaColores";
import TIPOLOGIAS from "../../../../data/tipologias";

interface FormAberturaProps {
  onNext: () => void; // Propiedad para avanzar
  onBack: () => void; // Propiedad para retroceder
}

const FormAbertura: React.FC<FormAberturaProps> = ({ onNext, onBack }) => {
  const { formData, updateFormData } = useFormContext();
  const [formValues, setFormValues] = useState({
    id: "",
    alto: "",
    ancho: "",
    cantidad: "",
    linea: "",
    color: "",
    tipoVidrio: "",
    mosquitero: false,
    acoplamiento: false,
    tipologia: "",
    observaciones: "",
  });

  const [registros, setRegistros] = useState<any[]>([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coloresDisponibles, setColoresDisponibles] = useState<string[]>([]);
  // Determinar si el campo "Línea" debe estar bloqueado:
  // Si existen registros y (no estamos editando, o estamos editando un registro que NO es el primero)
  const isLineLocked =
  registros.length > 0 && (!isEditing || (isEditing && editingId !== registros[0]?.id));



// Actualizar el contexto con los registros
useEffect(() => {
  if (registros.length > 0) {
    updateFormData("abertura", registros);
  }
}, [registros]); // Se elimina updateFormData de la lista de dependencias


  // Si la línea está bloqueada, tomamos la línea del primer registro; sino, la del form.
  const effectiveLinea = isLineLocked ? registros[0]?.linea : formValues.linea;

// Actualizar los colores disponibles según la línea seleccionada
useEffect(() => {
  if (effectiveLinea) {
    setColoresDisponibles(opcionesLineaColor[effectiveLinea] || []);
  } else {
    setColoresDisponibles([]);
  }
}, [effectiveLinea]);




  const handleInputChange = (field: string, value: any) => {
    setFormValues((prev) => {
      const updatedValues = { ...prev, [field]: value };
      updateFormData("abertura", updatedValues); // Actualizamos también el contexto
      return updatedValues;
    });
  };

  const handleGuardar = () => {
    if (!formValues.id.trim()) {
      alert("El campo ID es obligatorio.");
      return;
    }

    if (!isEditing && registros.some((registro) => registro.id === formValues.id)) {
      alert(`El ID "${formValues.id}" ya está registrado. Por favor, utiliza uno diferente.`);
      return;
    }

    if (isLineLocked) {
      formValues.linea = registros[0].linea;
    }

    if (isEditing && editingId) {
      setRegistros((prev) =>
        prev.map((registro) =>
          registro.id === editingId ? { ...registro, ...formValues } : registro
        )
      );
      setIsEditing(false);
      setEditingId(null);
    } else {
      setRegistros((prev) => [...prev, formValues]);
    }

    // Limpiar formulario
    setFormValues({
      id: "",
      alto: "",
      ancho: "",
      cantidad: "",
      linea: "",
      color: "",
      tipoVidrio: "",
      mosquitero: false,
      acoplamiento: false,
      tipologia: "",
      observaciones: "",
    });
  };

  const handleEdit = (registro: any) => {
    setFormValues(registro);
    setIsEditing(true);
    setEditingId(registro.id);
  };

  const handleDelete = (id: string) => {
    setRegistros((prev) => prev.filter((registro) => registro.id !== id));
  };




  return (
    <div className="form-abertura-wrapper">
      <FormLayoutPresupuesto
        subtitle="Datos de la Abertura"
        top="220px"
        buttons={
          <div className="abertura-form-buttons3">
            <button className="back-button3" onClick={onBack}>
              Volver
            </button>
            <button className="save-button3" onClick={handleGuardar}>
              Guardar
            </button>
            <button className="next-button3" onClick={onNext}>
              Siguiente
            </button>
          </div>
        }
      >
        <form className="abertura-form-cliente">
          <div className="abertura-form-grid">
            {/* ID */}
            <Input
              label="ID"
              type="text"
              value={formValues.id}
              onChange={(value) => handleInputChange("id", value)}
            />
            {/* Ancho */}
            <Input
              label="Ancho (cm)"
              type="text"
              value={formValues.ancho}
              onChange={(value) => handleInputChange("ancho", value)}
            />
            {/* Alto */}
            <Input
              label="Alto (cm)"
              type="text"
              value={formValues.alto}
              onChange={(value) => handleInputChange("alto", value)}
            />
            {/* Cantidad */}
            <Input
              label="Cantidad"
              type="number"
              value={formValues.cantidad}
              onChange={(value) => handleInputChange("cantidad", value)}
            />
            {/* Línea */}
            <Input
              label="Línea"
              type="select"
              options={Object.keys(opcionesLineaColor)}
              value={isLineLocked ? registros[0].linea : formValues.linea}
              onChange={(value) => {
                if (!isLineLocked) {
                  handleInputChange("linea", value);
                }
              }}
              disabled={isLineLocked}
            />
            {/* Color */}
            <Input
              label="Color"
              type="select"
              className="select-color"
              options={coloresDisponibles}
              value={formValues.color}
              onChange={(value) => handleInputChange("color", value)}
            />
            {/* Tipo de Vidrio */}
            <Input
              label="Tipo de Vidrio"
              type="select"
              options={"DVH,Simple,Float".split(",")}
              value={formValues.tipoVidrio}
              onChange={(value) => handleInputChange("tipoVidrio", value)}
            />
            {/* Tipología */}
            <Input
              label="Tipología"
              type="select"
              options={TIPOLOGIAS}
              value={formValues.tipologia}
              onChange={(value) => handleInputChange("tipologia", value)}
            />
            {/* Mosquitero */}
            <Input
              label="Mosquitero"
              type="checkbox"
              checked={formValues.mosquitero}
              onChange={(value) => handleInputChange("mosquitero", value)}
            />
            {/* Acoplamiento */}
            <Input
              label="Acoplamiento"
              type="checkbox"
              checked={formValues.acoplamiento}
              onChange={(value) => handleInputChange("acoplamiento", value)}
            />
            {/* Observaciones */}
            <Input
              label="Observaciones"
              type="text"
              value={formValues.observaciones}
              onChange={(value) => handleInputChange("observaciones", value)}
            />
          </div>
        </form>
      </FormLayoutPresupuesto>
      <RegistroAberturas
        registros={registros}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default FormAbertura;
