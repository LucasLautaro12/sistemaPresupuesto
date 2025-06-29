// src/components/TablaPresupuesto/OverlayPresupuesto.tsx
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../auth/AuthContext";

// APIs (ajusta las rutas si están en otra carpeta)
import {
  modificarCliente,
  modificarPresupuesto,
  modificarMonto,
  modificarMontoCerrado,
  eliminarArchivos,
  modificarArchivos,
  modificarAbertura,
} from "../../../api/modificarPresupuesto";
import { agregarAbertura, enviarMail } from "../../../api/fetchPresupuestos";

// Tu array de estados
const estadosPresupuesto = [
  "0.1 EN PRESUPUESTACION",
  "0.2 ENVIADO AL CLIENTE",
  "0.3 EN NEGOCIACION",
  "0.4 LICITACION",
  "0.5 EN ANALISIS DEL CLIENTE",
  "1.1 VENTA CONCRETADA",
  "1.2 NO COMPRA POR PRECIO",
  "1.3 NO COMPRA POR PLAZO",
  "1.4 NO COMPRA POR PREFERENCIA DE SERVICIO",
  "1.5 SIN RESPUESTA - OPERACION POSPUESTA",
  "1.6 AJUSTE DE SALDOS",
  "1.7 SOLICITA OTRA VERSION",
  "1.8 LICITACION SIN CONFIRMAR",
];

// Tipologías con sus rutas
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

// Subcomponentes (si los tenés en archivos separados, impórtalos)
// Si estaban integrados en tu overlay original, ponlos inline
import ConfirmationModal from "./ConfirmationModal";
import opcionesLineaColor from "../../../data/lineaColores";
import TIPOLOGIAS from "../../../data/tipologias";
import AberturasList from "./AberturasList";
import NotaSection from "./NotaSection";
import AddAberturaForm from "./AddAberturaForm";
import { crearTicket } from "../../../api/fetchTickets";

// Si usabas TIPOLOGIAS, lineaColores, etc. ajústalo

interface OverlayPresupuestoProps {
  presupuesto: any; // Ajusta si tenés un tipo
  onClose: () => void; // Para cerrar el overlay
}

const OverlayPresupuesto: React.FC<OverlayPresupuestoProps> = ({
  presupuesto,
  onClose,
}) => {
  const { permisos } = useContext(AuthContext);

  // Si no hay data, no renderiza
  if (!presupuesto) return null;

  useEffect(() => {
    document.body.classList.add("overlay-open");
    return () => {
      document.body.classList.remove("overlay-open");
    };
  }, []);

  // =====================================
  // 1) Función imprimirOverlay
  // =====================================
  const imprimirOverlay = () => {
    const overlayContent = document.querySelector(".overlay-content");
    if (overlayContent) {
      const overlayClone = overlayContent.cloneNode(true) as HTMLElement;
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Imprimir Overlay</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  font-size: 10px;
                  margin: 0;
                  padding: 10px;
                }
                @media print {
                  .print-hide,
                  .edit-buttons {
                    display: none !important;
                  }
                  .abertura-image {
                    width: 40px !important;
                    height: 40px !important;
                  }
                  .abertura-image img {
                    max-width: 40px !important;
                    max-height: 40px !important;
                  }
                  .abertura-grid,
                  .abertura-grid1 {
                    display: grid !important;
                    grid-template-columns: repeat(4, 1fr) !important;
                    gap: 10px !important;
                  }
                }
              </style>
            </head>
            <body>
              ${overlayClone.outerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  // =====================================
  // 2) Estado local para Cliente
  // =====================================
  const [isEditingCliente, setIsEditingCliente] = useState(false);
  const [tempCliente, setTempCliente] = useState({
    nombre: presupuesto.cliente?.nombre || "",
    celular: presupuesto.cliente?.celular || "",
    correo: presupuesto.cliente?.correo || "",
  });
  const saveCliente = () => {
    modificarCliente(
      tempCliente.celular,
      tempCliente.nombre,
      tempCliente.correo
    );
    presupuesto.cliente.nombre = tempCliente.nombre;
    presupuesto.cliente.celular = tempCliente.celular;
    presupuesto.cliente.correo = tempCliente.correo;
    setIsEditingCliente(false);
  };
  const cancelEditCliente = () => {
    setTempCliente({
      nombre: presupuesto.cliente?.nombre || "",
      celular: presupuesto.cliente?.celular || "",
      correo: presupuesto.cliente?.correo || "",
    });
    setIsEditingCliente(false);
  };

  // =====================================
  // 3) Estado local para Presupuesto (3 col)
  // =====================================
  const [isEditingPresupuesto, setIsEditingPresupuesto] = useState(false);
  const [tempEstado, setTempEstado] = useState(presupuesto.estado || "");
  const [tempUbicacion, setTempUbicacion] = useState(
    presupuesto.ubicacion || ""
  );
  const [tempOkTecnico, setTempOkTecnico] = useState(
    !!(presupuesto.okTecnico === "SI")
  );
  const [tempUrgencia, setTempUrgencia] = useState(!!presupuesto.urgencia);

  const editPresupuesto = () => {
    setIsEditingPresupuesto(true);
    setTempEstado(presupuesto.estado);
    setTempUbicacion(presupuesto.ubicacion);
    setTempOkTecnico(!!presupuesto.okTecnico);
    setTempUrgencia(!!presupuesto.urgencia);
  };
  const cancelEditPresupuesto = () => {
    setTempEstado(presupuesto.estado);
    setTempUbicacion(presupuesto.ubicacion);
    setTempOkTecnico(!!presupuesto.okTecnico);
    setTempUrgencia(!!presupuesto.urgencia);
    setIsEditingPresupuesto(false);
  };
  const savePresupuesto = () => {
    modificarPresupuesto({
      numPresupuesto: presupuesto.numPresupuesto,
      estado: tempEstado,
      ubicacion: tempUbicacion,
      okTecnico: tempOkTecnico,
      fechaInicio: presupuesto.fechaInicio,
      urgencia: tempUrgencia,
      montoPresupuestado: String(presupuesto.monto),
    });
    presupuesto.estado = tempEstado;
    presupuesto.ubicacion = tempUbicacion;
    presupuesto.okTecnico = tempOkTecnico;
    presupuesto.urgencia = tempUrgencia;
    setIsEditingPresupuesto(false);
  };
  console.log(typeof presupuesto.okTecnico);
  // =====================================
  // 4) Montos (4ta col)
  // =====================================
  const [isEditingMonto, setIsEditingMonto] = useState(false);
  const [tempMonto, setTempMonto] = useState(String(presupuesto.monto));
  const saveMonto = () => {
    modificarMonto(tempMonto, presupuesto.numPresupuesto);
    presupuesto.monto = tempMonto;
    setIsEditingMonto(false);
  };
  const [isEditingMontoCerrado, setIsEditingMontoCerrado] = useState(false);
  const [tempMontoCerrado, setTempMontoCerrado] = useState(
    String(presupuesto.montocerrado || "")
  );
  const saveMontoCerrado = () => {
    modificarMontoCerrado(tempMontoCerrado, presupuesto.numPresupuesto);
    presupuesto.montocerrado = tempMontoCerrado;
    setIsEditingMontoCerrado(false);
  };

  // =====================================
  // 5) Aberturas (antes de la Nota)
  // =====================================

  const [isAddingAbertura, setIsAddingAbertura] = useState(false);
  const [newAbertura, setNewAbertura] = useState({
    id: "",
    alto: "",
    ancho: "",
    cantidad: "",
    linea: "",
    color: "",
    tipoVidrio: "",
    mosquitero: false,
    acoplamiento: false,
    tipologia: "",
    observaciones: "",
  });

  const [aberturas, setAberturas] = useState(presupuesto.aberturas || []);
  const [editingAberturas, setEditingAberturas] = useState<boolean[]>(
    aberturas.map(() => false)
  );

  const handleSaveNewAbertura = () => {
    const nueva = {
      ...newAbertura,
      alto: parseFloat(newAbertura.alto) || 0,
      ancho: parseFloat(newAbertura.ancho) || 0,
      cantidad: parseInt(newAbertura.cantidad) || 0,
    };
    // Actualiza la lista de aberturas en el presupuesto
    presupuesto.aberturas = [...(presupuesto.aberturas || []), nueva];
    setIsAddingAbertura(false);
    setNewAbertura({
      id: "",
      alto: "",
      ancho: "",
      cantidad: "",
      linea: "",
      color: "",
      tipoVidrio: "",
      mosquitero: false,
      acoplamiento: false,
      tipologia: "",
      observaciones: "",
    });
    agregarAbertura([nueva], presupuesto.numPresupuesto);
  };

  const toggleEditAbertura = (index: number) => {
    setEditingAberturas((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };
  const handleAberturaChange = (index: number, field: string, value: any) => {
    setAberturas((prev) => {
      const newAberturas = [...prev];
      if (["ancho", "alto", "cantidad"].includes(field)) {
        newAberturas[index] = {
          ...newAberturas[index],
          [field]: parseFloat(value) || 0,
        };
      } else {
        newAberturas[index] = { ...newAberturas[index], [field]: value };
      }
      return newAberturas;
    });
  };
  const saveAbertura = (index: number) => {
    modificarAbertura(aberturas[index]);
    toggleEditAbertura(index);
  };

  // =====================================
  // 6) Nota (entre Aberturas y Archivos)
  // =====================================
  const [isEditingNota, setIsEditingNota] = useState(false);
  const [tempNota, setTempNota] = useState(presupuesto.nota || "");
  const saveNota = () => {
    presupuesto.nota = tempNota;
    setIsEditingNota(false);
  };
  const cancelEditNota = () => {
    setTempNota(presupuesto.nota || "");
    setIsEditingNota(false);
  };

  // =====================================
  // 7) Archivos
  // =====================================
  const [isEditingArchivos, setIsEditingArchivos] = useState(false);
  const [archivos, setArchivos] = useState(presupuesto.archivo || []);
  const handleAgregarArchivos = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    let archivosSeleccionados: FileList | null = null;
    if (e.dataTransfer) {
      archivosSeleccionados = e.dataTransfer.files;
    } else if (e.target.files) {
      archivosSeleccionados = e.target.files;
    } else {
      return;
    }

    const nuevosArchivos = Array.from(archivosSeleccionados).map(
      (file: File) => ({
        idarchivo: undefined,
        nombre: file.name,
        link: URL.createObjectURL(file),
        file: file,
      })
    );

    setArchivos((prev) => [...prev, ...nuevosArchivos]);
  };
  const handleEliminarArchivo = (index: number) => {
    const archivoAEliminar = archivos[index];
    eliminarArchivos(archivoAEliminar, presupuesto.numPresupuesto);
    setArchivos((prev) => {
      const copia = [...prev];
      copia.splice(index, 1);
      return copia;
    });
  };
  const saveArchivos = () => {
    modificarArchivos(presupuesto.numPresupuesto, archivos);
    setIsEditingArchivos(false);
  };
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
      return "../Extension/imagen.png";
    } else if (extensionesDocumento.includes(extension)) {
      return "../Extension/archivo.png";
    } else {
      return "../Extension/archivo.png";
    }
  };

  // =====================================
  // 8) Confirmación TK
  // =====================================
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<number | null>(
    null
  );
  const [password, setPassword] = useState("");

  const handleConfirmClick = (numPres: number) => {
    setSelectedPresupuesto(numPres);
    setShowConfirmation(true);
  };
  const handleConfirmTicket = () => {
    if (password === "tu_contraseña") {
      console.log(`Presupuesto ${selectedPresupuesto} confirmado como ticket.`);
      setShowConfirmation(false);
      setPassword("");
    } else {
      alert("Contraseña incorrecta.");
    }
  };
  const handleCancel = () => {
    setShowConfirmation(false);
    setPassword("");
  };

  // =====================================
  // 9) Convertir TK y Enviar Mail
  // =====================================
  const sendMail = () => {
    enviarMail();
  };
  const convertirTk = () => {
    console.log(presupuesto.okTecnico);
    if (
      !(tempOkTecnico && Number(tempMontoCerrado) > 0)
    ) {
      return alert("Se necesita okTecnico y montocerrado.");
    }
    if (presupuesto.numticket) {
      return alert("El presupuesto ya tiene un ticket asignado.");
    }

    try {
      crearTicket(presupuesto);
      console.log(presupuesto);
      alert(`El presupuesto N° ${presupuesto.numPresupuesto} se convirtió en ticket.`);
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      alert("Ocurrió un error al generar el ticket. Intente nuevamente.");
    }
  };

  // =====================================
  // 10) Hacer clcik fuera del overlay
  // =====================================
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si el elemento clickeado es el mismo que el contenedor, se hizo click fuera del contenido
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        {/* Botón Cerrar */}
        <div
          className="overlay-header"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button
            className="close-button print-hide"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          >
            ✖
          </button>
        </div>

        <h3>
          <strong>N° de Presupuesto: {presupuesto.numPresupuesto}</strong>
        </h3>

        {/* DATOS DEL CLIENTE */}
        <div
          className="aberturas-contenedor"
          style={{ position: "relative", marginBottom: "20px" }}
        >
          <h3>Datos del Cliente</h3>
          {(permisos.includes("MODIFICAR_PM_PRES") ||
            permisos.includes("ADMIN")) &&
            (isEditingCliente ? (
              <>
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "50px",
                    cursor: "pointer",
                  }}
                  onClick={saveCliente}
                >
                  💾
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  onClick={cancelEditCliente}
                >
                  ❌
                </span>
              </>
            ) : (
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer",
                }}
                onClick={() => setIsEditingCliente(true)}
              >
                ✏️
              </span>
            ))}
          <p>
            <strong>Cliente:</strong>{" "}
            {isEditingCliente ? (
              <input
                type="text"
                value={tempCliente.nombre}
                onChange={(e) =>
                  setTempCliente({ ...tempCliente, nombre: e.target.value })
                }
              />
            ) : (
              presupuesto.cliente || "Sin nombre"
            )}
          </p>
          <p>
            <strong>Teléfono:</strong>{" "}
            {isEditingCliente ? (
              <input
                type="text"
                value={tempCliente.celular}
                onChange={(e) =>
                  setTempCliente({ ...tempCliente, celular: e.target.value })
                }
              />
            ) : (
              presupuesto.celular || "Sin teléfono"
            )}
          </p>
          <p>
            <strong>Correo:</strong>{" "}
            {isEditingCliente ? (
              <input
                type="text"
                value={tempCliente.correo}
                onChange={(e) =>
                  setTempCliente({ ...tempCliente, correo: e.target.value })
                }
              />
            ) : (
              presupuesto.correo || "Sin correo"
            )}
          </p>
        </div>

        {/* DATOS DEL PRESUPUESTO (4 columnas) */}
        {/* BLOQUE 2: DATOS DEL PRESUPUESTO - 4 COLUMNAS */}
        <div className="general-info" style={{ marginBottom: "20px" }}>
          <h3>Datos del Presupuesto</h3>
          <div
            className="abertura-grid1"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: "20px",
              padding: "10px",
            }}
          >
            {/* Columna 1: Estado, Ubicación, OK Técnico, Urgencia */}
            <div style={{ position: "relative" }}>
              {/* Íconos en la PRIMERA columna, misma posición */}
              {(permisos.includes("MODIFICAR_PM_PRES") ||
                permisos.includes("ADMIN")) &&
                (isEditingPresupuesto ? (
                  <>
                    <span
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "30px",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      onClick={cancelEditPresupuesto}
                    >
                      ❌
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      onClick={savePresupuesto}
                    >
                      💾
                    </span>
                  </>
                ) : (
                  <span
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "0px",
                      cursor: "pointer",
                    }}
                    onClick={editPresupuesto}
                  >
                    ✏️
                  </span>
                ))}

              <p>
                <strong>Estado:</strong>{" "}
                {isEditingPresupuesto ? (
                  <select
                    value={tempEstado}
                    onChange={(e) => setTempEstado(e.target.value)}
                  >
                    {estadosPresupuesto.map((est, idx) => (
                      <option key={idx} value={est}>
                        {est}
                      </option>
                    ))}
                  </select>
                ) : (
                  tempEstado
                )}
              </p>
              <p>
                <strong>Ubicación:</strong>{" "}
                {isEditingPresupuesto ? (
                  <input
                    type="text"
                    value={tempUbicacion}
                    onChange={(e) => setTempUbicacion(e.target.value)}
                  />
                ) : (
                  tempUbicacion
                )}
              </p>
              <p>
                <strong>OK Técnico:</strong>{" "}
                {isEditingPresupuesto ? (
                  <select
                    value={tempOkTecnico ? "SI" : "NO"}
                    onChange={(e) => setTempOkTecnico(e.target.value === "SI")}
                  >
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                  </select>
                ) : tempOkTecnico ? (
                  "SI"
                ) : (
                  "NO"
                )}
              </p>

              <p>
                <strong>Urgencia:</strong>{" "}
                {isEditingPresupuesto ? (
                  <select
                    value={tempUrgencia ? "SI" : "NO"}
                    onChange={(e) => setTempUrgencia(e.target.value === "SI")}
                  >
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                  </select>
                ) : tempUrgencia ? (
                  "SI"
                ) : (
                  "NO"
                )}
              </p>
            </div>

            {/* Columna 2: Responsables (sin íconos de edición) */}
            <div>
              <p>
                <strong>Creado por:</strong>{" "}
                {presupuesto.responsables?.find((r: any) => r.rol === "CREADOR")
                  ?.nombre || "Desconocido"}
              </p>
              <p>
                <strong>Presupuestado por:</strong>{" "}
                {presupuesto.responsables?.find(
                  (r: any) => r.rol === "PRESUPUESTADOR"
                )?.nombre || "Desconocido"}
              </p>
              <p>
                <strong>Finalizado por:</strong>{" "}
                {presupuesto.responsables?.find(
                  (r: any) => r.rol === "FINALIZADOR"
                )?.nombre || "Desconocido"}
              </p>
            </div>

            {/* Columna 3: Fechas (sin íconos de edición) */}
            <div>
              <p>
                <strong>Fecha Inicio:</strong> {presupuesto.fechaInicio || "-"}
              </p>
              <p>
                <strong>Fecha Ganada:</strong>{" "}
                {presupuesto.fechaGanada || "No ganada aún"}
              </p>
            </div>

            {/* Columna 4: Montos (con línea divisoria) */}
            <div style={{ borderLeft: "1px solid #ccc", paddingLeft: "20px" }}>
              <p>
                <strong>Monto:</strong>{" "}
                {permisos.includes("ADMIN") ||
                permisos.includes("MODIFICAR_MONTO_PRES") ? (
                  isEditingMonto ? (
                    <>
                      <input
                        type="number"
                        value={tempMonto}
                        onChange={(e) => setTempMonto(e.target.value)}
                      />
                      <span
                        onClick={saveMonto}
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                      >
                        💾
                      </span>
                      <span
                        onClick={() => setIsEditingMonto(false)}
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                      >
                        ❌
                      </span>
                    </>
                  ) : (
                    <>
                      ${tempMonto}
                      <span
                        onClick={() => setIsEditingMonto(true)}
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                      >
                        ✏️
                      </span>
                    </>
                  )
                ) : (
                  <>${tempMonto}</>
                )}
              </p>
              <p>
  <strong>Monto Cerrado:</strong>{" "}
  {isEditingMontoCerrado ? (
    <>
      <input
        type="number"
        value={tempMontoCerrado}
        onChange={(e) => setTempMontoCerrado(e.target.value)}
      />
      { (permisos.includes("MODIFICAR_PM_PRES") || permisos.includes("ADMIN")) && (
        <>
          <span onClick={saveMontoCerrado} style={{ cursor: "pointer", marginLeft: "5px" }}>💾</span>
          <span onClick={() => setIsEditingMontoCerrado(false)} style={{ cursor: "pointer", marginLeft: "5px" }}>❌</span>
        </>
      )}
    </>
  ) : (
    <>
      ${tempMontoCerrado}
      { (permisos.includes("MODIFICAR_PM_PRES") || permisos.includes("ADMIN")) && (
        <span onClick={() => setIsEditingMontoCerrado(true)} style={{ cursor: "pointer", marginLeft: "5px" }}>✏️</span>
      )}
    </>
  )}
</p>
            </div>
          </div>
        </div>

        {/* ABERTURAS */}
        {/* BLOQUE 3: ABERTURAS */}
        <div className="aberturas" style={{ marginBottom: "20px" }}>
          <h3>Aberturas</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            {!isAddingAbertura &&
              (permisos.includes("MODIFICAR_PM_PRES") ||
                permisos.includes("ADMIN") ||
                permisos.includes("CREAR_PRES")) && (
                <button
                  className="add-button-overlay print-hide"
                  onClick={() => setIsAddingAbertura(true)}
                >
                  Agregar Abertura
                </button>
              )}
          </div>
          {isAddingAbertura && (
            <AddAberturaForm
              newAbertura={newAbertura}
              setNewAbertura={setNewAbertura}
              handleSaveNewAbertura={handleSaveNewAbertura}
              onCancel={() => setIsAddingAbertura(false)}
            />
          )}
          <AberturasList
            aberturas={presupuesto.aberturas}
            numPresupuesto={presupuesto.numPresupuesto}
            permisos={permisos}
          />
        </div>

        {/* BLOQUE 4: NOTA (entre Aberturas y Archivos) */}
        <div style={{ marginBottom: "20px", marginTop: "40px" }}>
          <NotaSection
            nota={tempNota}
            isEditingNota={isEditingNota}
            setIsEditingNota={setIsEditingNota}
            setNota={setTempNota}
            saveNota={saveNota}
            permisos={permisos}
          />
        </div>

        <hr style={{ margin: "20px 0" }} />

        {/* ARCHIVOS */}
        <h3>Archivos</h3>
        <div style={{ position: "relative", textAlign: "right" }}>
  {(permisos.includes("MODIFICAR_PM_PRES") || permisos.includes("ADMIN")) ? (
    isEditingArchivos ? (
      <>
        <span
          style={{ marginRight: "10px", cursor: "pointer" }}
          onClick={saveArchivos}
        >
          💾
        </span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => setIsEditingArchivos(false)}
        >
          ❌
        </span>
      </>
    ) : (
      <span
        style={{ cursor: "pointer" }}
        onClick={() => setIsEditingArchivos(true)}
      >
        ✏️
      </span>
    )
  ) : null}
</div>
        <div className="archivos-grid">
          {archivos.length === 0 ? (
            <p>No hay archivos disponibles.</p>
          ) : (
            archivos.map((archivo: any, index: number) => (
              <div
                key={index}
                className="archivo-item"
                style={{ position: "relative" }}
              >
                <a
                  href={`${archivo.link}?fl_attachment=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={obtenerIconoArchivo(archivo.nombre)}
                    alt={`Icono de ${archivo.nombre}`}
                    style={{ width: "50px", height: "50px" }}
                  />
                  <p>{archivo.nombre}</p>
                </a>
                {isEditingArchivos && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      backgroundColor: "red",
                      color: "white",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleEliminarArchivo(index)}
                  >
                    ✕
                  </span>
                )}
              </div>
            ))
          )}
        </div>
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

        {/* BOTONES FINALES */}
        <div className="overlay-buttons">
          <button className="print-hide" onClick={imprimirOverlay}>
            Imprimir
          </button>
          <button className="print-hide" onClick={sendMail}>
            Enviar por correo
          </button>
          <button
            className="print-hide"
            onClick={() => convertirTk()}
            style={{
              background: presupuesto.numticket
                ? "#ABACAC"
                : tempOkTecnico &&
                  Number(tempMontoCerrado) > 0
                ? "#4CAF50"
                : "#D32F2F",
              color: "white",
              border: "none",
            }}
          >
            Convertir en TK
          </button>
        </div>

        {/* MODAL DE CONFIRMACIÓN */}
        {showConfirmation && (
          <ConfirmationModal
            selectedPresupuesto={selectedPresupuesto}
            password={password}
            setPassword={setPassword}
            handleConfirmTicket={handleConfirmTicket}
            handleCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default OverlayPresupuesto;
