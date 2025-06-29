import axios from "axios";
import { urlBackend } from "../App";

export const fetchTickets = async (setTickets) => {
  try {
    const response = await axios.get(`${urlBackend}/ticket`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Enviar cookies automáticamente
    });
    setTickets(response.data);
  } catch (error) {
    console.error("Error al obtener los tickets:", error);
  }
};

export const crearTicket = async (presupuesto) => {
  try {
    await axios.post(`${urlBackend}/creartk`, {presupuesto},{
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
  }catch (error){
    console.error("Error al mandar los datos del ticket al backend: ", error)
  }
};
