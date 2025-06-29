import React from "react";
import "./SubmitButtons.css";

interface SubmitButtonsProps {
  onBack: () => void;
  onNext: () => void;
}

const SubmitButtons: React.FC<SubmitButtonsProps> = ({ onBack, onNext }) => {
  return (
    <div className="submit-buttons">
      <button onClick={onBack} className="back-button">
        Volver
      </button>
      <button onClick={onNext} className="next-button">
        Siguiente
      </button>
    </div>
  );
};

export default SubmitButtons;
