import React from "react";
import "./InputField.css";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string; // Prop para el mensaje de error
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  error,
}) => {
  return (
    <div className={`input-field ${error ? "error" : ""}`}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Mensaje de error */}
    </div>
  );
};

export default InputField;
