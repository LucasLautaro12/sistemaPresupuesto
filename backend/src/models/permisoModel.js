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

Rol.belongsToMany(Permiso, {
    through: 'rolpermiso',
    foreignKey: 'idrol',
    as: 'permisos',
    otherKey: 'idpermiso',
    timestamps: false
  });

Permiso.belongsToMany(Rol, {
    through: 'rolpermiso',
    foreignKey: 'idpermiso',
    as: 'rols',
    otherKey: 'idrol',
    timestamps: false
  });


