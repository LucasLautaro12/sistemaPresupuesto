//import { getPool } from "../db.js"; //Exporto la conexion de la bd

//POO Persona
class Persona {
  constructor(idpersona, apellido, nombre, correo) {
    this.idpersona = idpersona;
    this.apellido = apellido;
    this.nombre = nombre;
    this.correo = correo;
  }
}

export default Persona;

//Obtener persona
export const persona = async (req, res) => {
  try {
    // Obtener los datos de la persona desde la base de datos
    const persona = await getPersona();
    console.log("Datos obtenidos:", persona); // Verifica que los datos se obtienen correctamente

    // Si no se encuentra la persona, devuelve un error 400
    if (!persona) {
      return res.status(400).json({
        message: "User not found...",
      });
    }

    // Si se encuentran los datos, los enviamos al frontend
    return res.json({
      idpersona: persona.idpersona,
      nombre: persona.nombre,
      apellido: persona.apellido,
      correo: persona.correo,
    });
  } catch (error) {
    console.error("Error en la función persona:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//Guardar persona
export const savePersona = async (nuevaPersona) => {
  const pool = getPool();
  const query = `INSERT INTO persona(idpersona, nombre, apellido, correo) VALUES($1, $2, $3, $4) RETURNING *;`;

  const values = [
    nuevaPersona.idpersona,
    nuevaPersona.apellido,
    nuevaPersona.nombre,
    nuevaPersona.correo,
  ];

  try {
    const result = await pool.query(query, values);
    console.log("Persona guardada: ", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

//Obtener Id
export const getIdpersona = async (idpersona) => {
  try {
    const pool = getPool();
    const query = `
        SELECT * FROM persona WHERE idpersona = $1
    `;
    const result = await pool.query(query, [idpersona]);

    return result.rows[0];
  } catch (error) {
    console.log("Error en idpersona: ", error);
    throw error;
  }
};