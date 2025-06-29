import React from "react";
import "./DepartmentOption.css";

interface DepartmentOptionProps {
  id: string;
  label: string;
  icon: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const DepartmentOption: React.FC<DepartmentOptionProps> = ({
  id,
  label,
  icon,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`department-option ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(id)}
    >
      <div className={`icon ${icon}`} />
      <p>{label}</p>
    </div>
  );
};

export default DepartmentOption;
