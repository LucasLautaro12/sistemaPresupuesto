import React, { useState, useEffect } from "react";
import "../styles/TablaPres.css";
import "../styles/UsuarioTable.css"; // Mantengo el estilo existente
import { fetchTickets } from "../../api/fetchTickets";
import "../styles/TablaTK.css"

/* interface Cliente {
  id: number;
  nombre: string;
} */

interface Ticket {
  numticket: number;
  numpresupuesto: number;
  fechacomienzo: string;
  fem: string;
  cliente: string;
  obra: string;
  zona: string;
  direccion: string;
  /* contacto: string; // Lo mantenemos en datos pero no lo mostramos */
  responsable: string;
  linea: string;
  total_cantidad: number;
  nota: string;
  estado: string;
}

const TablaTK: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* useEffect(() => {
    const exampleTickets: Ticket[] = [
      {
        id: 1,
        numeroPresupuesto: 101,
        fechaCreacion: "25-01-12",
        fechaEstimadaPrueba: "25-01-20",
        cliente: { id: 1, nombre: "Juan Pérez" },
        obra: "Edificio Central",
        zona: "Z1",
        direccion: "Av. Siempre Viva 123",
        contacto: "123-456789",
        responsable: "Carlos Gómez",
        linea: "Residencial",
        cantidadAberturas: 5,
        observaciones: "Revisar detalles técnicos.",
        estado: "Pendiente",
      },
      {
        id: 2,
        numeroPresupuesto: 102,
        fechaCreacion: "25-01-15",
        fechaEstimadaPrueba: "25-01-25",
        cliente: { id: 2, nombre: "Ana López" },
        obra: "Casa Familiar",
        zona: "Z3",
        direccion: "Calle Falsa 456",
        contacto: "987-654321",
        responsable: "Laura Díaz",
        linea: "Comercial",
        cantidadAberturas: 10,
        observaciones: "Confirmar medidas.",
        estado: "Completado",
      },
    ];
    setTickets(exampleTickets);
  }, []); */

  useEffect(() => {
    fetchTickets(setTickets)
  },[]);
  

  const normalizeText = (text: string) =>
    text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

  const filteredTickets = tickets.filter(
    (ticket) =>
      normalizeText(ticket.cliente).includes(normalizeText(searchTerm)) ||
      normalizeText(ticket.obra).includes(normalizeText(searchTerm)) ||
      normalizeText(ticket.estado).includes(normalizeText(searchTerm)) ||
      ticket.numpresupuesto.toString().includes(searchTerm)
  );

  return (
    <div>
      <div className="search-and-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <table className="data-table">
            <thead>
              <tr>
                <th >TK</th>
                <th >N° P.</th>
                <th >FC</th>
                <th >FEM</th>
                <th >Cliente</th>
                <th >Obra</th>
                <th >Zona</th>
                <th >Dirección</th>
                <th>Respons.</th>
                <th>Línea</th>
                <th >Cant. Ab.</th>
                <th >Obs.</th>
                <th>Estado</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="table-body">
          <table className="data-table">
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.numticket}>
                  <td>{ticket.numticket}</td>
                  <td>{ticket.numpresupuesto}</td>
                  <td >{ticket.fechacomienzo}</td>
                  <td >{ticket.fem}</td>
                  <td >{ticket.cliente}</td>
                  <td >{ticket.obra}</td>
                  <td >{ticket.zona}</td>
                  <td className="truncate">{ticket.direccion}</td>
                  <td >{ticket.responsable}</td>
                  <td >{ticket.linea}</td>
                  <td >{ticket.total_cantidad}</td>
                  <td className="truncate" >{ticket.nota}</td>
                  <td >{ticket.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaTK;
