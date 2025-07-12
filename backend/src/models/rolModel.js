import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import { Permiso } from "./permisoModel.js";

export const Rol = sequelize.define('rol', {
    idrol: { type: DataTypes.INTEGER, primaryKey: true },
    nombrerol: DataTypes.STRING,
},{tableName: 'rol', timestamps: false});

