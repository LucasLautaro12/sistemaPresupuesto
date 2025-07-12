//import { getPool } from "../db.js"; //Exporto la conexion de la bd
import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import { Usuario } from "./usuarioModel.js";

export const Persona = sequelize.define('persona', {
  idpersona: { type: DataTypes.INTEGER, primaryKey: true },
  apellido: DataTypes.STRING,
  nombre: DataTypes.STRING,
  correo: DataTypes.STRING,
}, {
  tableName: 'persona',
  timestamps: false,
});

Usuario.belongsTo(Persona, {
  foreignKey: 'idpersona',
  onDelete: 'CASCADE'
});

Persona.hasOne(Usuario, {
  foreignKey: 'idpersona'
});
