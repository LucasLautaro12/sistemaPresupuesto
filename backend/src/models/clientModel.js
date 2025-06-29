import { getPool } from "../db.js";
import { getMaxId } from "./presupuestoModel.js";
import Persona from "./personaModel.js";

class Cliente extends Persona {
  constructor(idpersona, apellido, nombre, correo, celular) {
    super(idpersona, apellido, nombre, correo);
    this.celular = celular;
  }
}

export default Cliente;

//Obtener Cliente
export const getClienteByCelular = async (celular) => {
  const pool = getPool();
  const query = `
        SELECT c.celular
        FROM cliente c
        JOIN persona p ON c.idPersona = p.idPersona
        WHERE c.celular = $1`;

  try {
    const result = await pool.query(query, [celular]);

    if (result.rows.length === 0) {
      return;
    }

    const row = result.rows[0];

    return new Cliente(
      row.idpersona,
      row.apellido ? row.apellido.trim() : "",
      row.nombre ? row.nombre.trim() : "",
      row.correo || "",
      row.celular
    );
  } catch (error) {
    console.log("Error en la consulta de cliente: ", error);
    throw error;
  }
};

//Guardar Cliente
export const saveCliente = async (nuevoCliente) => {
  const pool = getPool();
  const queryPersona = `INSERT INTO persona (idPersona, apellido, nombre, correo) VALUES ($1, $2, $3, $4) RETURNING idPersona;`;
  const queryCliente = `INSERT INTO cliente (celular, idPersona) VALUES ($1, $2) RETURNING *;`;

  const maxIdPersona = await getMaxId("idpersona", "persona");
  const idpersona = maxIdPersona + 1;

  try {
    //Guardar persona
    const personaResult = await pool.query(queryPersona, [
      idpersona,
      nuevoCliente.apellido,
      nuevoCliente.nombre,
      nuevoCliente.correo,
    ]);

    const idPersona = personaResult.rows[0].idpersona;
    //Guardar cliente
    const numCelular = parseInt(nuevoCliente.celular);
    const clienteResult = await pool.query(queryCliente, [
      numCelular,
      idPersona,
    ]);

    return clienteResult.rows[0];
  } catch (error) {
    console.log("Error en: ", error);
    throw error;
  }
};

//Modificar Cliente
export const updateCliente = async (celular, nombre, apellido, correo) => {
  const pool = getPool();
  const queryCliente = `
    UPDATE persona
    SET nombre = $2, apellido = $3, correo = $4
    WHERE idpersona = (SELECT idpersona FROM cliente WHERE celular = $1)
  `;

  try {
    await pool.query(queryCliente, [celular, nombre, apellido, correo]);
    return { message: "Cliente actualizado" };
  } catch (error) {
    console.error("updateCliente: ", error);
    throw error;
  }
};
