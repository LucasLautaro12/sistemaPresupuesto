import React from 'react';
import '../CreateUser/InputField/InputField.css';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string | boolean) => void;
  type?: string;
  options?: string[];
  checked?: boolean;
  error?: string; // Nueva prop para mostrar errores
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  options,
  checked,
  error,
  disabled,
}) => {
  return (
    <div className="input-field">
          <label>{label}</label>
          {type === "select" && options ? (
              <select
                  value={typeof value === "string" ? value : ""}
                  onChange={(e) => onChange(e.target.value)}
              >
                  <option value="">Seleccione...</option>
                  {options.map((option, index) => (
                      <option key={index} value={option}>
                          {option}
                      </option>
                  ))}
              </select>
          ) : type === "checkbox" ? (
            <input
              type="checkbox"
              checked={checked || false} // Utiliza la propiedad checked
              onChange={(e) => onChange(e.target.checked)}
            />
          ) : (
            <input
              type={type}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            />
          )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Input;


