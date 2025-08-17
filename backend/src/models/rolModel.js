import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import { Usuario } from "./usuarioModel.js";

export const Rol = sequelize.define('rol', {
    idrol: { type: DataTypes.INTEGER, primaryKey: true },
    nombrerol: DataTypes.STRING,
},{tableName: 'rol', timestamps: false});

Usuario.belongsToMany(Rol, {
    through: 'usuariorol',
    foreignKey: 'dni',
    otherKey: 'idrol',
    as: 'rols',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    timestamps: false
  });
  
Rol.belongsToMany(Usuario, {
    through: 'usuariorol',
    foreignKey: 'idrol',
    otherKey: 'dni',
    as: 'usuario',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    timestamps: false
  });