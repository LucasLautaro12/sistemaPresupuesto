import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import { Rol } from "./rolModel.js";

export const Permiso = sequelize.define('permiso', {
    idpermiso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'permiso',
    timestamps: false
})

