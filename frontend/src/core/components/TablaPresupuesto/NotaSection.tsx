// NotaSection.tsx
import React from "react";

interface NotaSectionProps {
  nota: string;
  isEditingNota: boolean;
  setIsEditingNota: (val: boolean) => void;
  setNota: (val: string) => void;
  saveNota: () => void;
  permisos: string[];
}

const NotaSection: React.FC<NotaSectionProps> = ({
  nota,
  isEditingNota,
  setIsEditingNota,
  setNota,
  saveNota,
  permisos,
}) => {
  return (
    <div className="nota" style={{ position: "relative" }}>
      <h3>Nota</h3>

      {permisos.includes("MODIFICAR_PM_PRES") || permisos.includes("ADMIN") ? (
        isEditingNota ? (
          <div style={{ position: "relative", marginTop: "10px" }}>
            <textarea
              style={{ width: "100%", height: "80px" }}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
            {/* Botones de Guardar y Cancelar */}
            <span
              style={{
                position: "absolute",
                top: "5px",
                right: "40px",
                cursor: "pointer",
              }}
              onClick={saveNota}
            >
              💾
            </span>
            <span
              style={{
                position: "absolute",
                top: "5px",
                right: "10px",
                cursor: "pointer",
              }}
              onClick={() => setIsEditingNota(false)}
            >
              ❌
            </span>
          </div>
        ) : (
          <div style={{ position: "relative", marginTop: "10px" }}>
            <p>{nota || "Sin nota"}</p>
            {/* Botón de Editar */}
            <span
              style={{
                position: "absolute",
                top: "0px",
                right: "10px",
                cursor: "pointer",
              }}
              onClick={() => setIsEditingNota(true)}
            >
              ✏️
            </span>
          </div>
        )
      ) : (
        <p>{nota || "Sin nota"}</p>
      )}
    </div>
  );
};

export default NotaSection;
