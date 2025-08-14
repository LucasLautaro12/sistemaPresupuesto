// models/usuarioPresupuesto.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

export const UsuarioPresupuesto = sequelize.define('usuariopresupuesto', {
  dni: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  numpresupuesto: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  responsable: DataTypes.STRING
}, {
  tableName: 'usuariopresupuesto',
  timestamps: false
});
