// src/components/TablaPresupuesto/AddAberturaForm.tsx

import React from "react";
import opcionesLineaColor from "../../../data/lineaColores";
import TIPOLOGIAS from "../../../data/tipologias";

interface AddAberturaFormProps {
  newAbertura: {
    id: string;
    alto: string;
    ancho: string;
    cantidad: string;
    linea: string;
    color: string;
    tipoVidrio: string;
    mosquitero: boolean;
    acoplamiento: boolean;
    tipologia: string;
    observaciones: string;
  };
  setNewAbertura: (value: {
    id: string;
    alto: string;
    ancho: string;
    cantidad: string;
    linea: string;
    color: string;
    tipoVidrio: string;
    mosquitero: boolean;
    acoplamiento: boolean;
    tipologia: string;
    observaciones: string;
  }) => void;
  handleSaveNewAbertura: () => void;
  onCancel: () => void;
}

const AddAberturaForm: React.FC<AddAberturaFormProps> = ({
  newAbertura,
  setNewAbertura,
  handleSaveNewAbertura,
  onCancel,
}) => {
  return (
    <div
      className="new-abertura-form"
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "20px",
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        {/* Fila 1: ID, Ancho */}
        <div className="form-field">
          <label className="small-label">ID</label>
          <input
            type="text"
            className="small-input"
            value={newAbertura.id}
            onChange={(e) =>
              setNewAbertura({ ...newAbertura, id: e.target.value })
            }
          />
        </div>
        <div className="form-field">
          <label className="small-label">Ancho (cm)</label>
          <input
            type="number"
            className="small-input"
            value={newAbertura.ancho}
            onChange={(e) =>
              setNewAbertura({ ...newAbertura, ancho: e.target.value })
            }
          />
        </div>
        {/* Fila 2: Alto, Cantidad */}
        <div className="form-field">
          <label className="small-label">Alto (cm)</label>
          <input
            type="number"
            className="small-input"
            value={newAbertura.alto}
            onChange={(e) =>
              setNewAbertura({ ...newAbertura, alto: e.target.value })
            }
          />
        </div>
        <div className="form-field">
          <label className="small-label">Cantidad</label>
          <input
            type="number"
            className="small-input"
            value={newAbertura.cantidad}
            onChange={(e) =>
              setNewAbertura({ ...newAbertura, cantidad: e.target.value })
            }
          />
        </div>
        {/* Fila 3: Línea, Color */}
        <div className="form-field">
          <label className="small-label">Línea</label>
          <select
            className="small-select"
            value={newAbertura.linea}
            onChange={(e) =>
              setNewAbertura({
                ...newAbertura,
                linea: e.target.value,
                color: "",
              })
            }
          >
            <option value="">Selecciona una línea</option>
            {Object.keys(opcionesLineaColor).map((linea) => (
              <option key={linea} value={linea}>
                {linea}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="small-label">Color</label>
          <select
            className="small-select"
            value={newAbertura.color}
            onChange={(e) =>
              setNewAbertura({ ...newAbertura, color: e.target.value })
            }
          >
            <option value="">Selecciona un color</option>
            {newAbertura.linea &&
              opcionesLineaColor[newAbertura.linea] &&
              opcionesLineaColor[newAbertura.linea].map((color: string) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
          </select>
        </div>
        {/* Fila 4: Tipo de Vidrio, Tipología */}
        <div className="form-field">
          <label className="small-label">Tipo de Vidrio</label>
          <select
            className="small-select"
            value={newAbertura.tipoVidrio}
            onChange={(e) =>
              setNewAbertura({ ...newAbertura, tipoVidrio: e.target.value })
            }
          >
            <option value="">Selecciona un tipo</option>
            {["DVH", "Simple", "Float"].map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="small-label">Tipología</label>
          <select
            className="small-select"
            value={newAbertura.tipologia}
            onChange={(e) =>
              setNewAbertura({ ...newAbertura, tipologia: e.target.value })
            }
          >
            <option value="">Selecciona una tipología</option>
            {TIPOLOGIAS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
        {/* Fila 5: Mosquitero, Accionamiento */}
        <div className="form-field">
          <label className="small-label">Mosquitero</label>
          <input
            type="checkbox"
            className="small-checkbox"
            checked={newAbertura.mosquitero}
            onChange={(e) =>
              setNewAbertura({ ...newAbertura, mosquitero: e.target.checked })
            }
          />
        </div>
        <div className="form-field">
          <label className="small-label">Accionamiento</label>
          <input
            type="checkbox"
            className="small-checkbox"
            checked={newAbertura.acoplamiento}
            onChange={(e) =>
              setNewAbertura({ ...newAbertura, acoplamiento: e.target.checked })
            }
          />
        </div>
        {/* Fila 6: Observaciones (ocupa ambas columnas) */}
        <div className="form-field" style={{ gridColumn: "1 / span 2" }}>
          <label className="small-label">Observaciones</label>
          <input
            type="text"
            className="small-input"
            value={newAbertura.observaciones}
            onChange={(e) =>
              setNewAbertura({ ...newAbertura, observaciones: e.target.value })
            }
          />
        </div>
      </div>
      <div
        className="observaciones-buttons print-hide"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <button className="print-hide" onClick={handleSaveNewAbertura}>
          Guardar
        </button>
        <button className="print-hide" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default AddAberturaForm;
