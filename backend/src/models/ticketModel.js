import { getPool } from "../db.js";
import { getMaxId } from "./presupuestoModel.js";

class Ticket {
  constructor(
    numticket,
    numpresupuesto,
    fechacomienzo,
    fem,
    obra,
    zona,
    direccion,
    tipolinea,
    total_cantidad,
    nota,
    estado,
    responsable,
    cliente
  ) {
    this.numticket = numticket;
    this.numpresupuesto = numpresupuesto;
    this.fechacomienzo = fechacomienzo;
    this.fem = fem;
    this.obra = obra;
    this.zona = zona;
    this.direccion = direccion;
    this.tipolinea = tipolinea;
    this.total_cantidad = total_cantidad;
    this.nota = nota;
    this.estado = estado;
    this.responsable = responsable;
    this.cliente = cliente;
  }
}

export default Ticket;

export const getTickets = async () => {
  const pool = getPool();
  const query = `
      SELECT 
        t.numticket, 
        p.numpresupuesto, 
        t.fechacomienzo, 
        t.fem, 
        t.obra, 
        t.zona, 
        p.direccion, 
        l.tipolinea, 
        SUM(a.cantidad) AS total_cantidad, 
        t.nota, 
        t.estado, 
        CONCAT(pers.nombre, ' ', pers.apellido) AS responsable, 
        CONCAT(pc.nombre, ' ', pc.apellido) AS cliente
      FROM ticket t
      JOIN presupuesto p ON t.numticket = p.numticket
      JOIN abertura a ON a.numpresupuesto = p.numpresupuesto
      JOIN linea l ON l.idlinea = a.idlinea
      JOIN usuariopresupuesto up ON up.numpresupuesto = p.numpresupuesto
      JOIN usuario u ON u.dni = up.dni
      JOIN persona pers ON u.idpersona = pers.idpersona  
      JOIN clientepresupuesto cp ON cp.numpresupuesto = p.numpresupuesto
      JOIN cliente c ON c.celular = cp.celular
      JOIN persona pc ON c.idpersona = pc.idpersona  
      GROUP BY 
        t.numticket, p.numpresupuesto, t.fechacomienzo, t.fem, 
        t.obra, t.zona, p.direccion, t.nota, t.estado, l.tipolinea, 
        pers.nombre, pers.apellido, pc.nombre, pc.apellido;`;

  try {
    const result = await pool.query(query);

    return result.rows.map((row) => {
      // Convertir fecha a formato YYYY-MM-DD
      const formatDate = (date) =>
        date ? new Date(date).toISOString().split("T")[0] : "";

      return new Ticket(
        row.numticket,
        row.numpresupuesto,
        formatDate(row.fechacomienzo),
        formatDate(row.fem),
        row.obra || "",
        row.zona || "",
        row.direccion || "",
        row.tipolinea,
        row.total_cantidad,
        row.nota || "",
        row.estado,
        row.responsable,
        row.cliente
      );
    });
  } catch (error) {
    console.error("Error al obtener los tickets:", error);
  }
};


export const createTicket = async (ticket) => {
  const pool = getPool();
  const queryTicket = `
        INSERT INTO ticket (numticket, estado, obra, zona, nota, fechacomienzo, fem)
        VALUES ($1, $2, $3, $4, $5, NOW(), $6)
        `;
  const queryUpdatePresupuesto = `
        UPDATE presupuesto
        SET numticket = $2
        WHERE numpresupuesto = $1
    `;
  try {
    
    const ticketGuardado = await pool.query(queryTicket, [
      ticket.numticket,
      ticket.estado,
      ticket.obra,
      ticket.zona,
      ticket.nota,
      ticket.fem,
    ]);

    await pool.query(queryUpdatePresupuesto, [
      ticket.numpresupuesto,
      ticket.numticket,
    ]);
    console.log(ticketGuardado.rows[0])
    return "listo";
  } catch (error) {
    console.error("Error en ticketModel.createTicket: ", error);
  }
};
