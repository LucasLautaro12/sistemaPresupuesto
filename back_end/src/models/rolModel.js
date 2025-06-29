import { getPool } from "../db.js";

class Rol{
    constructor(idrol, nombre){
        this.idrol = idrol;
        this.nombre = nombre
    }
}

export const getRolByName = async (roles) => {
    const pool = getPool()
    const query = `
        SELECT idrol 
        FROM rol 
        WHERE nombrerol = $1;
    `;

    try {
        // Usamos Promise.all para esperar todas las consultas
        const results = await Promise.all(roles.map(rol => pool.query(query, [rol.toUpperCase()])))
        
        // Extraemos los idrol de cada resultado
        const ids = results.map(result => result.rows[0]?.idrol)

        return ids
    } catch (error) {
        console.error("Error al consultar los idrol: ", error)
        throw error
    }
}