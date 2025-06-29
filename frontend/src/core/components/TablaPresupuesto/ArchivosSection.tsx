// src/components/TablaPresupuesto/ArchivosSection.tsx

import React from "react";
import { eliminarArchivos, modificarArchivos } from "../../../api/modificarPresupuesto";

interface Archivo {
  idarchivo?: number;
  nombre: string;
  link: string;
  file?: File;
}

interface ArchivosSectionProps {
  archivos: Archivo[];
  setArchivos: React.Dispatch<React.SetStateAction<Archivo[]>>;
  isEditingArchivos: boolean;
  setIsEditingArchivos: (val: boolean) => void;
  numPresupuesto: number;
}

const ArchivosSection: React.FC<ArchivosSectionProps> = ({
  archivos,
  setArchivos,
  isEditingArchivos,
  setIsEditingArchivos,
  numPresupuesto,
}) => {
  // Elimina un archivo del estado y del backend
  const handleEliminarArchivo = (index: number) => {
    const archivoAEliminar = archivos[index];
    eliminarArchivos(archivoAEliminar, numPresupuesto);
    setArchivos((prev) => {
      const copia = [...prev];
      copia.splice(index, 1);
      return copia;
    });
  };

  // Guarda los archivos en el backend y cierra el modo edición
  const saveArchivos = () => {
    modificarArchivos(numPresupuesto, archivos);
    setIsEditingArchivos(false);
  };

  // Maneja tanto el drop de archivos como la selección desde input file
  const handleAgregarArchivos = (
    e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    let archivosSeleccionados: FileList | null = null;

    // Si es DragEvent (dataTransfer)
    if ("dataTransfer" in e) {
      archivosSeleccionados = e.dataTransfer.files;
    }
    // Si es ChangeEvent (target.files)
    else if ("target" in e && e.target instanceof HTMLInputElement && e.target.files) {
      archivosSeleccionados = e.target.files;
    } else {
      console.log("No se seleccionó ningún archivo.");
      return;
    }

    const nuevosArchivos = Array.from(archivosSeleccionados).map((file: File) => ({
      idarchivo: undefined,
      nombre: file.name,
      link: URL.createObjectURL(file),
      file: file,
    }));

    setArchivos((prev) => [...prev, ...nuevosArchivos]);
  };

  // Determina el ícono según la extensión, usando tus rutas originales
  const obtenerIconoArchivo = (nombreArchivo: string) => {
    const extension = nombreArchivo.split(".").pop()?.toLowerCase() || "";
    const extensionesImagen = ["jpg", "jpeg", "png", "gif", "bmp"];
    const extensionesDocumento = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "exe",
      "zip",
    ];

    if (extensionesImagen.includes(extension)) {
      return "../Extension/imagen.png";   // Mismo que tu código original
    } else if (extensionesDocumento.includes(extension)) {
      return "../Extension/archivo.png";  // Mismo que tu código original
    } else {
      return "../Extension/archivo.png";  // Por defecto
    }
  };

  return (
    <div>
      <h3>Archivos</h3>

      {/* Botones de edición / guardado en la esquina superior derecha */}
      <div style={{ position: "relative", textAlign: "right" }}>
        {isEditingArchivos ? (
          <>
            <span style={{ marginRight: "10px", cursor: "pointer" }} onClick={saveArchivos}>
              💾
            </span>
            <span style={{ cursor: "pointer" }} onClick={() => setIsEditingArchivos(false)}>
              ❌
            </span>
          </>
        ) : (
          <span style={{ cursor: "pointer" }} onClick={() => setIsEditingArchivos(true)}>
            ✏️
          </span>
        )}
      </div>

      {/* Lista de archivos */}
      <div className="archivos-grid">
        {(!archivos || archivos.length === 0) ? (
          <p>No hay archivos disponibles.</p>
        ) : (
          archivos.map((archivo, index) => (
            <div key={index} className="archivo-item">
              <a
                href={`${archivo.link}?fl_attachment=true`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={obtenerIconoArchivo(archivo.nombre)}
                  alt={`Icono de ${archivo.nombre}`}
                />
                <p>{archivo.nombre}</p>
              </a>
              {isEditingArchivos && (
                <span
                  style={{ cursor: "pointer", color: "red", marginLeft: "5px" }}
                  onClick={() => handleEliminarArchivo(index)}
                >
                  ✕
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Área para arrastrar o seleccionar archivos cuando se está en modo edición */}
      {isEditingArchivos && (
        <div
          className="arrastrar-archivos"
          onClick={() => document.getElementById("archivo-input")?.click()}
          onDrop={handleAgregarArchivos}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          style={{
            cursor: "pointer",
            padding: "20px",
            border: "2px dashed #ccc",
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            marginTop: "10px",
          }}
        >
          <p>Arrastra archivos aquí o haz click para seleccionar</p>
          <input
            type="file"
            id="archivo-input"
            multiple
            onChange={handleAgregarArchivos}
            style={{ display: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default ArchivosSection;
