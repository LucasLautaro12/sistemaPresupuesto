//import { getPool } from "../db.js";

class Departamento{
    constructor(iddepartamento, nombre){
        this.iddepartamento = iddepartamento;
        this.nombre = nombre
    }
}

//Obterner departamento por nombre
export const getDepartamentoByName = async (nombreDto) => {
    const pool = getPool();
    const query = `
        SELECT iddepartamento 
        FROM departamento 
        WHERE nombre = $1
    `
    try {
      const result = await pool.query(query,[nombreDto])
      const row = result.rows[0].iddepartamento
      return row
    } catch (error) {
      console.error("Error al consultar el nombre del departamento: ",error)
      res
        .status(500)
        .json({ message: "Ocurrió un error al consultar el nombre del departamento.", error });
    }
  }