//import { getPool } from "../db.js"; //Exporto la conexion de la bd
import sequelize from "../db.js";
import { DataTypes } from "sequelize";

export const Persona = sequelize.define('persona', {
  idpersona: { type: DataTypes.INTEGER, primaryKey: true },
  apellido: DataTypes.STRING,
  nombre: DataTypes.STRING,
  correo: DataTypes.STRING,
}, {
  tableName: 'persona',
  timestamps: false,
});

