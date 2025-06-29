//import { getPool } from '../db.js'

//Clase Vidrio
class Linea {
    constructor(idlinea, tipolinea, color) {
        this.idlinea = idlinea;
        this.tipolinea = tipolinea;
        this.color = color;
    };
};

export default Linea;

//Obtener Datos Vidrio
export const getLineaByTipolinea = async (tipolinea, color) => {
    const pool = getPool();
    const query = `
        SELECT idlinea
        FROM linea 
        WHERE tipolinea = $1 AND color =$2;
    `;

    try {
        const result = await pool.query(query, [tipolinea, color]);

        if (result.rows.length === 0) {
            throw new Error("Linea no encontrada...");
        }

        return  result.rows[0].idlinea;
    } catch (error) {
        console.log("Error en: ", error);
        throw error;
    };
};