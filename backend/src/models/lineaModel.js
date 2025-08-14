//import { getPool } from '../db.js'

import { DataTypes } from "sequelize";
import sequelize from "../db.js";

export const Linea = sequelize.define('linea', {
    idlinea: { type: DataTypes.INTEGER, primaryKey: true },
    tipolinea: DataTypes.STRING,
    color: DataTypes.STRING
}, {
    tableName: 'linea',
    timestamps: false
});



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

        return result.rows[0].idlinea;
    } catch (error) {
        console.log("Error en: ", error);
        throw error;
    };
};