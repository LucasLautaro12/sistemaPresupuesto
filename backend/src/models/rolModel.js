//import { getPool } from "../db.js";

import sequelize from "../db.js";
import { DataTypes } from "sequelize";


export const Rol = sequelize.define('rol', {
    idrol: { type: DataTypes.INTEGER, primaryKey: true },
    nombrerol: DataTypes.STRING,
},{tableName: 'rol', timestamps: false});

Rolpermiso.belongsTo(Rol, { foreignKey: 'idrol', onDelete: 'SET NULL' });
Rol.hasMany(Rolpermiso, { foreignKey: 'idrol' });

Rolpermiso.belongsTo(Permiso, { foreignKey: 'idpermiso', onDelete: 'SET NULL' });
Permiso.hasMany(Rolpermiso, { foreignKey: 'idpermiso' });