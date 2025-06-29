//import { getPool } from "../db.js"; //Exporto la conexion de la bd
import Cliente, { getClienteByCelular, saveCliente } from "./clientModel.js";

class Presupuesto {
  constructor(
    numpresupuesto,
    fechainicio,
    urgencia,
    nota,
    oktecnico,
    estado,
    fechaganada,
    direccion
  ) {
    this.numpresupuesto = numpresupuesto;
    this.fechainicio = fechainicio;
    this.urgencia = urgencia;
    this.nota = nota;
    this.oktecnico = oktecnico;
    this.estado = estado;
    this.fechaganada = fechaganada;
    this.direccion = direccion;
  }
}

export default Presupuesto;
//Obtener el numero maximo de presupuesto
export const getMaxId = async (id, tabla) => {
  const pool = getPool();
  const query = `SELECT COALESCE(MAX(${id}), 0) AS max_num FROM ${tabla};`;
  try {
    const result = await pool.query(query);
    return result.rows[0].max_num;
  } catch (error) {
    console.log(`Error en ${tabla}: `, error);
    throw error;
  }
};

export const savePresupuesto = async (cliente, nuevoPresupuesto, usuario) => {
  try {
    const pool = getPool();
    const numCelular = parseInt(cliente.telefono);
    //Obtener el cliente por el celular
    const nuevoCliente = await getClienteByCelular(numCelular);

    //Si no existe el cliente, se guarda
    if (!nuevoCliente) {
      const clienteForm = new Cliente(
        cliente.idpersona ? cliente.idpersona.trim() : "",
        cliente.apellido ? cliente.apellido.trim() : "",
        cliente.nombre ? cliente.nombre.trim() : "",
        cliente.correo ? cliente.correo.trim() : "",
        numCelular
      );
      const nuevoCliente = await saveCliente(clienteForm);
    }

    const maxnumpresupuesto = await getMaxId("numpresupuesto", "presupuesto");
    const nuevonumpresupuesto = maxnumpresupuesto + 1;

    const queryPresupuesto = `
    INSERT INTO presupuesto (numpresupuesto, fechainicio, urgencia, nota, monto, oktecnico, estado, fechaganada, direccion) 
    VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8) RETURNING numpresupuesto;`;

    const monto = 0
  
    const clienteGuardado = await pool.query(queryPresupuesto, [
      nuevonumpresupuesto,
      nuevoPresupuesto.urgencia ? nuevoPresupuesto.urgencia.toUpperCase() === "SI" : false,
      nuevoPresupuesto.nota ? nuevoPresupuesto.nota : '',
      monto,
      nuevoPresupuesto.oktecnico ? nuevoPresupuesto.oktecnico : false,
      nuevoPresupuesto.estado
        ? nuevoPresupuesto.estado
        : "0.1 EN PRESUPUESTACION",
      nuevoPresupuesto.fechaganada,
      cliente.ubicacion,
    ]);

    const numpresupuestoGuardado = clienteGuardado.rows[0].numpresupuesto;

    const queryCliePres = `
      INSERT INTO clientepresupuesto(numpresupuesto,celular)
      VALUES ($1,$2)
    `;
    await pool.query(queryCliePres, [numpresupuestoGuardado, numCelular]);

    const queryUsuaPres = `
      INSERT INTO usuariopresupuesto(dni, numpresupuesto, responsable)
      VALUES ($1, $2, $3)
      ON CONFLICT (dni, numpresupuesto, responsable) DO NOTHING;`;
    const dniUsuario = parseInt(usuario.dni);
    const responsable = "CREADOR";

    await pool.query(queryUsuaPres, [
      dniUsuario,
      numpresupuestoGuardado,
      responsable,
    ]);

    return numpresupuestoGuardado;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateMonto = async (
  monto,
  numpresupuesto,
  usuario,
  query,
  responsable
) => {
  const pool = getPool();
  const dni = usuario.dni;

  const queryUsPres = `
      INSERT INTO usuariopresupuesto(dni, numpresupuesto, responsable)
      VALUES ($1, $2, $3)
      ON CONFLICT (dni, numpresupuesto, responsable) DO NOTHING;`;

  try {
    await pool.query(query, [numpresupuesto, monto]);
    await pool.query(queryUsPres, [dni, numpresupuesto, responsable]);
    return { success: true, message: "Monto actualizado" };
  } catch (error) {
    console.error("Error al actualizar el monto:", error);
    return {
      success: false,
      message: "Ocurrió un error al actualizar el monto.",
      error,
    };
  }
};

export const updatePresupuesto = async (presupuesto) => {
  const pool = getPool();
  const query = `
    UPDATE presupuesto
    SET 
      fechainicio = $2,
      urgencia = $3,
      nota = $4,
      oktecnico = $5,
      estado = $6,
      fechaganada = $7, 
      direccion = $8
    WHERE numpresupuesto = $1 

  `;
  try {
    console.log(presupuesto);
    await pool.query(query, [
      presupuesto.numpresupuesto,
      presupuesto.fechainicio,
      presupuesto.urgencia,
      presupuesto.nota,
      presupuesto.oktecnico,
      presupuesto.estado,
      presupuesto.fechaganada,
      presupuesto.direccion,
    ]);
    return { message: "Presupuesto actualizado." };
  } catch (error) {
    console.error("Error en actualizar presupuesto: ", error);
    throw error;
  }
};
