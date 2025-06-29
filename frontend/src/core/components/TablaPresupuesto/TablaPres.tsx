// src/components/TablaPresupuesto/TablaPres.tsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../auth/AuthContext";
import "../../styles/UsuarioTable.css";
import "../../styles/TablaPres.css";
// Supongo que ya tienes implementada la función fetchPresupuestos en tus APIs
import { fetchPresupuestos } from "../../../api/fetchPresupuestos";
import OverlayPresupuesto from "./OverlayPresupuesto";

const TablaPres: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [okTecnicoFilter, setOkTecnicoFilter] = useState("");
  const [responsableFilter, setResponsableFilter] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para controlar el Overlay
  const [overlay, setOverlay] = useState<{
    visible: boolean;
    data: any | null;
  }>({
    visible: false,
    data: null,
  });

  const { permisos } = useContext(AuthContext);

  useEffect(() => {
    fetchPresupuestos(setData, setLoading, setError);
  }, []);

  const handleNotaClick = (rowData: any) => {
    setOverlay({ visible: true, data: rowData });
  };

  const closeOverlay = () => {
    setOverlay({ visible: false, data: null });
    // Si quieres refrescar la data al cerrar
    fetchPresupuestos(setData, setLoading, setError);
  };

// Normaliza una cadena: elimina espacios extra, acentos y pasa a minúsculas.
const normalizeString = (str: string | undefined) =>
  (str || "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const getResponsable = (row: any) => {
  return row.responsables?.find((r: any) => r.rol === "FINALIZADOR")?.nombre ||
         row.responsables?.find((r: any) => r.rol === "CREADOR")?.nombre ||
         "Sin asignar";
};

const filteredData = data.filter((row) => {
  const normalizedSearchTerm = normalizeString(searchTerm);
  const budgetNumber = normalizeString(String(row.numPresupuesto));
  const client = normalizeString(row.cliente);

  // Se filtra por número y cliente, sin fechas
  const coincideSearch =
    !normalizedSearchTerm ||
    budgetNumber.includes(normalizedSearchTerm) ||
    client.includes(normalizedSearchTerm);

  const coincideEstado = !estadoFilter || row.estado === estadoFilter;
  const coincideOkTecnico =
    !okTecnicoFilter || (row.okTecnico ? "SI" : "NO") === okTecnicoFilter;
  
  const responsable = getResponsable(row);
  const coincideResponsable = !responsableFilter || responsable === responsableFilter;
  
  return coincideSearch && coincideEstado && coincideOkTecnico && coincideResponsable;
});

const uniqueResponsables = () => {
  const responsables = data.map(row => getResponsable(row));
  const setResp = new Set(responsables);
  return Array.from(setResp).sort();
};

  const uniqueValues = (key: string) => {
    const setValues = new Set(
      data
        .map((row) => (row[key] || "").toString().trim())
        .filter((value) => value !== "")
    );
    return Array.from(setValues).sort();
  };

  return (
    <div>
      {/* FILTROS */}
      <div className="search-and-filters">
  <div className="search-bar">
    <input
      type="text"
      placeholder="Buscar por número, cliente, fecha o estado..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
  <div className="filters">
    <div className="filter">
      <label>Estado:</label>
      <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
        <option value="">Todos</option>
        {uniqueValues("estado").map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
    <div className="filter">
      <label>OK Técnico:</label>
      <select value={okTecnicoFilter} onChange={(e) => setOkTecnicoFilter(e.target.value)}>
        <option value="">Todos</option>
        <option value="SI">SI</option>
        <option value="NO">NO</option>
      </select>
    </div>
    <div className="filter">
    <label>Responsable:</label>
    <select value={responsableFilter} onChange={(e) => setResponsableFilter(e.target.value)}>
      <option value="">Todos</option>
      {uniqueResponsables().map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  </div>
  </div>
</div>

      {/* TABLA */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Fecha Inicio</th>
              <th>Cliente</th>
              <th>Ubicación</th>
              <th>OK Técnico</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Fecha Ganada</th>
              <th>Nota</th>
              <th>Responsable</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr
                key={row.numPresupuesto}
                style={{
                  backgroundColor: row.urgencia
                    ? "#f8d7da" // rojo clarito si urgencia = true
                    : "white",
                }}
              >
                <td>{row.numPresupuesto}</td>
                <td>{row.fechaInicio}</td>
                <td>{row.cliente}</td>
                <td>{row.ubicacion}</td>
                <td>{row.okTecnico === "SI" ? "SI" : "NO"}</td>
                <td>$ {row.monto}</td>
                <td>{row.estado}</td>
                <td>{row.fechaGanada || ""}</td>
                <td>{row.nota ? row.nota.substring(0, 8) + "..." : ""}</td>
                <td>
                  {row.responsables?.find((r: any) => r.rol === "FINALIZADOR")
                    ?.nombre ||
                    row.responsables?.find((r: any) => r.rol === "CREADOR")
                      ?.nombre ||
                    "Sin asignar"}
                </td>
                <td style={{ textAlign: "center" }}>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleNotaClick(row)}
                  >
                    📋
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OVERLAY */}
      {overlay.visible && overlay.data && (
        <OverlayPresupuesto presupuesto={overlay.data} onClose={closeOverlay} />
      )}
    </div>
  );
};

export default TablaPres;
