// src/components/TablaPresupuesto/ConfirmationModal.tsx
import React from "react";

interface ConfirmationModalProps {
  selectedPresupuesto: number | null;
  password: string;
  setPassword: (val: string) => void;
  handleConfirmTicket: () => void;
  handleCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  selectedPresupuesto,
  password,
  setPassword,
  handleConfirmTicket,
  handleCancel,
}) => {
  return (
    <div
      className="confirmation-modal"
      style={{
        padding: "20px",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      }}
    >
      <h3>Confirma con tu contraseña</h3>
      <p>
        ¿Está seguro de confirmar el presupuesto {selectedPresupuesto} como ticket?
      </p>
      <input
        type="password"
        placeholder="Introduce tu contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button onClick={handleConfirmTicket} style={{ marginRight: "10px" }}>
        Confirmar
      </button>
      <button onClick={handleCancel}>Cancelar</button>
    </div>
  );
};

export default ConfirmationModal;
