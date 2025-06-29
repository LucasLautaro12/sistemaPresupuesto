import React from "react";
import "./RolesOption.css";

interface RolesOptionProps {
  role: string;
  image: string;
  isSelected: boolean;
  onSelect: (role: string) => void;
}

const RolesOption: React.FC<RolesOptionProps> = ({role,image,isSelected,onSelect,
}) => {
    return(
        <div
            className={`roles-option ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(role)}
        >                                  
            <div className={`icon ${image}`} /> 
            <p>{role}</p>
        </div>   
    );
};

export default RolesOption;
