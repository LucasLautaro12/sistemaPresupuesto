import React from "react";
import "./FormLayoutPresupuesto.css";

interface FormLayoutProps {
  subtitle?: string;
  buttons: React.ReactNode;
  children: React.ReactNode;
  top?: string;
}

const FormLayoutPresupuesto: React.FC<FormLayoutProps> = ({
  subtitle,
  buttons,
  children,
  top,
}) => {
  return (
    <div className="presupuesto-form-layout" 
    style={{ top: top || "0px", position: "relative" }}>
      <div className="presupuesto-form-header">
        <h2>Nuevo Presupuesto</h2>
        {subtitle && <h3 className="subtitle">{subtitle}</h3>}
      </div>
      {children}
      {buttons} 
    </div>
  );
};

export default FormLayoutPresupuesto;

