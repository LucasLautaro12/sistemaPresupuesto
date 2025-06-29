import React, { createContext, useState, useContext } from "react";

// Definir el tipo para los datos del formulario
interface FormData {
  cliente: {
    apellido: string;
    nombre: string;
    telefono: string;
    ubicacion: string;
  } | null;
  abertura: Array<{
    id: string;
    alto: string;
    ancho: string;
    cantidad: string;
    linea: string;
    color: string;
    tipoVidrio: string;
    mosquitero: boolean;
    accionamiento: boolean;
    tipologia: string;
    observaciones: string;
  }> | null;
  presupuesto: {
    urgencia: string;
    nota: string;
    archivos: File[];
  } | null;
}

// Crear el contexto
export const FormContext = createContext<{
  formData: FormData;
  updateFormData: (formName: string, newData: any) => void;
}>( {
  formData: {
    cliente: null,
    abertura: null,
    presupuesto: null,
  },
  updateFormData: () => {}, // Función vacía por defecto
});

// Hook para usar el contexto
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext debe ser usado dentro de un FormContext.Provider");
  }
  return context;
};

// Componente proveedor del contexto
export const FormDataProvider: React.FC = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({
    cliente: null,
    abertura: null,
    presupuesto: null,
  });

  const updateFormData = (formName: string, newData: any) => {
    console.log(`Actualizando contexto para ${formName}:`, newData); // Verifica si se llega aquí
    setFormData((prev) => ({
      ...prev,
      [formName]: newData,
    }));
  };
  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};
