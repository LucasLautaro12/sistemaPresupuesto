import { getMaxId } from "../models/presupuestoModel.js";
import Ticket, { createTicket, getTickets } from "../models/ticketModel.js";
import { agregarFilaGoogleSheet } from "../service/googleSheetService.js";

export const ticket = async (req, res) => {
  try {
    const tickets = await getTickets();
    return res.json(tickets);
  } catch (error) {
    console.error("Error al obtener los tickets:", error);
  }
};

export const creartk = async (req, res) => {
    console.log("Creando Ticket...")
    console.log(req.body.presupuesto)
  try {
    const {numPresupuesto, ubicacion, responsables, cliente, aberturas} = req.body.presupuesto;

    const responsable = responsables[2] ? responsables[2].nombre : 'SIN RESPONSABLE';
    const tipolinea = aberturas[0].tipolinea;
    const total_cantidad = aberturas.reduce((acc, abertura) => acc + abertura.cantidad,0)
    const maxTicket = await getMaxId("numticket", "ticket");
    let numticket = maxTicket + 1;

    const nuevoticket = new Ticket(
      numticket, numPresupuesto, "", null, "", "", ubicacion, tipolinea, total_cantidad, "", "0.0- SIN ESTADO", responsable, cliente
    )

    const numpresupuesto = 12
    const fem = "2025-02-12"
    const obra = "ObraPrueba"
    const zona = "ZonaPrueba"
    const direccion = "DireccionPrueba"
    const responsablep = "ResponsablePrueba"
    const linea = "LineaPrueba"
    const total_cantidad1 = 89
    const nota = "NotaPrueba"

    const nuevoTicket2 = new Ticket(
      numticket,
      numpresupuesto,
      "",
      fem,
      obra,
      zona,
      direccion,
      linea,
      total_cantidad1,
      nota,
      "",
      responsablep,
      ""
    );

    const ticketGuardado = await createTicket(nuevoticket);

    await agregarFilaGoogleSheet(nuevoTicket2);

    console.log(`Ticket ${nuevoTicket2.numpresupuesto} creado con exito.`);

    return res.status(200).json({
      success: true,
      message: "Ticket creado con éxito.",
    });
  } catch (error) {
    console.error("Error al crear el ticket:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};
