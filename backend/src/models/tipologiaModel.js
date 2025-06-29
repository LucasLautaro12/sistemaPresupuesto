//import { getPool } from '../db.js'

class Tipologia {
    constructor(idtipologia, tipologia) {
        this.idtipologia = idtipologia;
        this.tipologia = tipologia;
    }
}

export default Tipologia;

export const getTipologiaByNombre = async (nombretipologia) => {
    const pool = getPool()
    const query = `
        SELECT idtipologia
        FROM tipologia
        WHERE nombretipologia = $1
    `;

    try {
        const result = await pool.query(query, [nombretipologia]);

        if(result.rows.length === 0){
            throw new Error("Tipologia no encontrado...")
        }

        return result.rows[0].idtipologia;
    } catch (error) {
        console.log("Error en: ", error);
        throw error;
    }
}