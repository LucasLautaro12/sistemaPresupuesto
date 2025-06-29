// src/components/TablaPresupuesto/AberturasList.tsx
import React, { useState } from "react";
import { modificarAbertura } from "../../../api/modificarPresupuesto";
import opcionesLineaColor from "../../../data/lineaColores";
import TIPOLOGIAS from "../../../data/tipologias";  // Se importa y se usará igual que en tu código original

interface AberturasListProps {
  aberturas: any[];
  numPresupuesto: number;
  permisos: string[];
}

const tipologiaImagenes: { [key: string]: string } = {
    "PAÑO FIJO": "/Tipologia/PF.png",
    "VENTANA BATIENTE": "/Tipologia/V1.png",
    "VENTANA OSCILO-BATIENTE": "/Tipologia/VO1.png",
    "VENTANA BANDEROLA": "/images/ventana-banderola.png",
    "VENTANA DESPLAZANTE": "/images/ventana-desplazante.png",
    "VENTANA PROYECTANTE": "/Tipologia/PR.png",
    "PUERTA PIVOTANTE": "/Tipologia/PIV.png",
    "MAMPARA CORREDIZA": "/Tipologia/MC2.png",
    "MAMPARA DE ABRIR": "/Tipologia/M1.png",
    "MAMPARA FIJA": "/Tipologia/MPF.png",
    "BARANDA MINIPOSTES": "/Tipologia/B-MP.png",
    "BARANDA BOTONES": "/Tipologia/B-BOT.png",
    "BARANDA HYDRO": "/images/baranda-hydro.png",
    "BARANDA IMPERIA": "/Tipologia/B-IMP.png",
  };
  
  const obtenerImagenTipologia = (nombretipologia: string) => {
    return tipologiaImagenes[nombretipologia] || "/images/default.png";
  };  

const AberturasList: React.FC<AberturasListProps> = ({ aberturas, numPresupuesto, permisos }) => {
  const [editingAberturas, setEditingAberturas] = useState<boolean[]>(aberturas.map(() => false));
  const [aberturasState, setAberturasState] = useState<any[]>(aberturas);

  const toggleEditAbertura = (index: number) => {
    setEditingAberturas((prev) => {
      const newEditing = [...prev];
      newEditing[index] = !newEditing[index];
      return newEditing;
    });
  };

  const handleAberturaChange = (index: number, field: string, value: any) => {
    setAberturasState((prev) => {
      const newAberturas = [...prev];
      newAberturas[index] = { ...newAberturas[index], [field]: value };
      return newAberturas;
    });
  };

  const saveAbertura = (index: number) => {
    const abertura = aberturasState[index];
    modificarAbertura(abertura);
    toggleEditAbertura(index);
  };

  return (
    <div className="aberturas-contenedor">
      {aberturasState.length === 0 ? (
        <p>No hay aberturas disponibles.</p>
      ) : (
        aberturasState.map((abertura, index) => (
          <div key={index} style={{ position: "relative", marginBottom: "10px" }}>
            {((permisos.includes("MODIFICAR_PM_PRES")) || permisos.includes("ADMIN")) && (
              editingAberturas[index] ? (
                <>
                  <span
                    style={{ position: "absolute", top: "10px", right: "50px", cursor: "pointer" }}
                    onClick={() => saveAbertura(index)}
                  >
                    💾
                  </span>
                  <span
                    style={{ position: "absolute", top: "10px", right: "20px", cursor: "pointer" }}
                    onClick={() => toggleEditAbertura(index)}
                  >
                    ❌
                  </span>
                </>
              ) : (
                <span
                  style={{ position: "absolute", top: "10px", right: "20px", cursor: "pointer" }}
                  onClick={() => toggleEditAbertura(index)}
                >
                  ✏️
                </span>
              )
            )}
            <div className="abertura-grid">
              <div>
                <p>
                  <strong>ID:</strong>{" "}
                  {editingAberturas[index] ? (
                    <input
                      value={abertura.nombreAbertura || ""}
                      onChange={(e) => handleAberturaChange(index, "nombreAbertura", e.target.value)}
                    />
                  ) : (
                    abertura.nombreAbertura
                  )}
                </p>
                <p>
                  <strong>Ancho:</strong>{" "}
                  {editingAberturas[index] ? (
                    <input
                      type="number"
                      value={abertura.ancho}
                      onChange={(e) => handleAberturaChange(index, "ancho", parseFloat(e.target.value))}
                    />
                  ) : (
                    abertura.ancho
                  )}
                </p>
                <p>
                  <strong>Alto:</strong>{" "}
                  {editingAberturas[index] ? (
                    <input
                      type="number"
                      value={abertura.alto}
                      onChange={(e) => handleAberturaChange(index, "alto", parseFloat(e.target.value))}
                    />
                  ) : (
                    abertura.alto
                  )}
                </p>
                <p>
                  <strong>Cantidad:</strong>{" "}
                  {editingAberturas[index] ? (
                    <input
                      type="number"
                      value={abertura.cantidad}
                      onChange={(e) => handleAberturaChange(index, "cantidad", parseInt(e.target.value))}
                    />
                  ) : (
                    abertura.cantidad
                  )}
                </p>
              </div>
              <div>
                <p>
                  <strong>Línea:</strong>{" "}
                  {editingAberturas[index] ? (
                    <select
                      value={abertura.tipolinea || ""}
                      onChange={(e) => handleAberturaChange(index, "tipolinea", e.target.value)}
                    >
                      <option value="">Seleccione línea</option>
                      {Object.keys(opcionesLineaColor).map((linea) => (
                        <option key={linea} value={linea}>
                          {linea}
                        </option>
                      ))}
                    </select>
                  ) : (
                    abertura.tipolinea
                  )}
                </p>
                <p>
                  <strong>Color:</strong>{" "}
                  {editingAberturas[index] ? (
                    <select
                      value={abertura.color || ""}
                      onChange={(e) => handleAberturaChange(index, "color", e.target.value)}
                      disabled={!abertura.tipolinea}
                    >
                      <option value="">Seleccione color</option>
                      {(opcionesLineaColor[abertura.tipolinea] || []).map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  ) : (
                    abertura.color
                  )}
                </p>
                <p>
                  <strong>Tipo de Vidrio:</strong>{" "}
                  {editingAberturas[index] ? (
                    <select
                      value={abertura.tipovidrio || ""}
                      onChange={(e) => handleAberturaChange(index, "tipovidrio", e.target.value)}
                    >
                      <option value="SIMPLE">SIMPLE</option>
                      <option value="DVH">DVH</option>
                      <option value="TEMPLADO">TEMPLADO</option>
                    </select>
                  ) : (
                    abertura.tipovidrio
                  )}
                </p>
              </div>
              <div>
                <p>
                  <strong>Mosquitero:</strong>{" "}
                  {editingAberturas[index] ? (
                    <select
                      value={abertura.mosquitero ? "SI" : "NO"}
                      onChange={(e) => handleAberturaChange(index, "mosquitero", e.target.value === "SI")}
                    >
                      <option value="SI">SI</option>
                      <option value="NO">NO</option>
                    </select>
                  ) : (
                    abertura.mosquitero ? "SI" : "NO"
                  )}
                </p>
                <p>
                  <strong>Acoplamiento:</strong>{" "}
                  {editingAberturas[index] ? (
                    <select
                      value={abertura.acoplamiento ? "SI" : "NO"}
                      onChange={(e) => handleAberturaChange(index, "acoplamiento", e.target.value === "SI")}
                    >
                      <option value="SI">SI</option>
                      <option value="NO">NO</option>
                    </select>
                  ) : (
                    abertura.acoplamiento ? "SI" : "NO"
                  )}
                </p>
                <p>
                  <strong>Observaciones:</strong>{" "}
                  {editingAberturas[index] ? (
                    <input
                      type="text"
                      value={abertura.detalle || ""}
                      onChange={(e) => handleAberturaChange(index, "detalle", e.target.value)}
                    />
                  ) : (
                    abertura.detalle || "-"
                  )}
                </p>
              </div>
              <div>
              <div className="abertura-image">
                {abertura.nombretipologia ? (
                    <>
                    <img
                        src={obtenerImagenTipologia(abertura.nombretipologia)}
                        alt={abertura.nombretipologia}
                        style={{ maxWidth: "80px", maxHeight: "80px" }}
                    />
                    {editingAberturas[index] ? (
                      <select
                        value={abertura.tipologia}
                        onChange={(e) => handleAberturaChange(index, "tipologia", e.target.value)}
                      >
                        {TIPOLOGIAS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    ) : (
                      <p>{abertura.tipologia}</p>
                    )}
                    </>
                ) : (
                    <span>Sin imagen</span>
                )}
                </div>
              </div>
            </div>
            {index !== aberturasState.length - 1 && <hr className="separador-abertura" />}
          </div>
        ))
      )}
    </div>
  );
};

export default AberturasList;
