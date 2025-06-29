import React from "react";
import '../styles/Overlay.css';

const Overlay = ({ isVisible, onClose, data }) => {
  if (!isVisible) return null;

  const handlePrint = () => {
    const overlayContent = document.querySelector('.overlay-content');
    const printWindow = window.open('', '_blank');

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
              margin: 0;
              padding: 20px;
            }
            .overlay-content {
              width: 100%;
            }
          </style>
        </head>
        <body>
          ${overlayContent?.outerHTML}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>Cerrar</button>
        <button className="print-button" onClick={handlePrint}>Imprimir</button>

        {/* Sección de encabezado */}
        <div className="general-info">
          <div className="general-row">
            <span><strong>N° de Presupuesto:</strong> 18000</span>
            <span><strong>Cliente:</strong> Perez Pepe</span>
          </div>
          <div className="general-row">
            <span><strong>Urgencia:</strong> Sí</span>
            <span><strong>Fecha:</strong> 09/02/2024</span>
          </div>
          <div className="general-row">
            <span><strong>Monto Presupuestado:</strong> $</span>
            <span><strong>Teléfono:</strong> 3884123456</span>
          </div>
          <div className="general-row">
            <span><strong>OK Técnico:</strong></span>
            <span><strong>Ubicación:</strong> B° El Carmen - Dique La Ciénaga</span>
          </div>
          <div className="general-row">
            <span><strong>Estado:</strong></span>
            <span><strong>Fecha Ganada:</strong></span>
          </div>
        </div>
        <div className="section-divider"></div>

        {/* Detalle de aberturas */}
        {data.items.map((item, index) => (
          <div key={index} className="section">
            <h3 className="section-title">Detalle de Abertura {index + 1}</h3>
            <div className="item-row">
              <p><strong>ID:</strong> {item.id}</p>
              <p><strong>Ancho:</strong> {item.width}</p>
              <p><strong>Alto:</strong> {item.height}</p>
              <p><strong>Cantidad:</strong> {item.quantity}</p>
            </div>
            <div className="item-row">
              <p><strong>Tipo de Vidrio:</strong> {item.glassType}</p>
              <p><strong>Mosquitero:</strong> {item.mosquitoNet}</p>
              <p><strong>Color:</strong> {item.color}</p>
              <p><strong>Accionamiento:</strong> {item.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overlay;