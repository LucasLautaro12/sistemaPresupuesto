import React from "react";
import "./RegistroAberturas.css";

interface Registro {
  id: string;
  alto: string;
  ancho: string;
  cantidad: string;
  linea: string;
  color: string;
  tipoVidrio: string;
  mosquitero: boolean;
  accionamiento: boolean;
  tipologia: string;
  observaciones: string;
}

interface RegistroAberturasProps {
  registros: Registro[];
  onEdit?: (registro: Registro) => void;
  clienteData: { apellido: string; nombre: string; telefono: string; ubicacion: string } | null;
  fechaActual: string;
}

const RegistroAberturas: React.FC<RegistroAberturasProps> = ({ registros, onEdit, onDelete, clienteData, fechaActual }) => {
  console.log(clienteData, fechaActual);
  return (
    <div className="registro-aberturas">
       {/* Datos del cliente en un estilo minimalista */}
       {clienteData && (
        <div className="cliente-info" style={{ marginBottom: '10px', padding: '10px', borderBottom: '1px solid #ddd' }}>
          <p><strong>{clienteData.apellido} {clienteData.nombre}</strong></p>
          <p>{clienteData.telefono} - {clienteData.ubicacion}</p>
          <p>{fechaActual}</p>
        </div>
      )}
      
      <h3>Registros Guardados</h3>
      <table className="tabla-nueva">
        <thead>
          <tr>
            <th>ID</th>
            <th>Alto</th>
            <th>Ancho</th>
            <th>Cantidad</th>
            <th>Línea</th>
            <th>Color</th>
            <th>Tipo Vidrio</th>
            <th>Tipología</th>
            <th>Mosquitero</th>
            <th>Accionamiento</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro, index) => (
            <tr key={index}>
              <td data-label="ID">{registro.id}</td>
              <td data-label="Alto">{registro.alto}</td>
              <td data-label="Ancho">{registro.ancho}</td>
              <td data-label="Cantidad">{registro.cantidad}</td>
              <td data-label="Línea">{registro.linea}</td>
              <td data-label="Color">{registro.color}</td>
              <td data-label="Tipo Vidrio">{registro.tipoVidrio}</td>
              <td data-label="Tipología">{registro.tipologia}</td>
              <td data-label="Mosquitero">{registro.mosquitero ? "Sí" : "No"}</td>
              <td data-label="Accionamiento">{registro.accionamiento ? "Sí" : "No"}</td>
              <td data-label="Observaciones">{registro.observaciones}</td>
              <td data-label="Acciones">
                {/* Ícono de edición */}
                <button
                  className="edit-button"
                  onClick={() => onEdit(registro)}
                  title="Editar registro"
                >
                  ✎
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDelete(registro.id)}  // Llamamos a la función de eliminar
                  title="Eliminar registro"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistroAberturas;
