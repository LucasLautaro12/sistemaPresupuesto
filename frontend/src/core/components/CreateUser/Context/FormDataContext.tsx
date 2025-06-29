import React, { createContext, useContext, useState, ReactNode } from "react";

interface FormData {
  user: { name: string; email: string }; // Puedes agregar los campos que necesites
  department: string | null;
  role: string | null;
  permissions: number[];
}

const FormDataContext = createContext<any | undefined>(undefined);

// Define las props del componente, incluyendo children
interface FormDataProviderProps {
  children: ReactNode; // Los componentes hijos pueden ser cualquier cosa (string, JSX, etc.)
}

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("useFormData must be used within a FormDataProvider");
  }
  return context;
};

export const FormDataProvider: React.FC<FormDataProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({
    user: { name: "", email: "" },
    department: null,
    role: null,
    permissions: [],
  });

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};