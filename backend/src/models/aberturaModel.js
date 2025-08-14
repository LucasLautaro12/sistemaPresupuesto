//import { getPool } from "../db.js";
import { getMaxId, Presupuesto } from "./presupuestoModel.js";
import { getLineaByTipolinea, Linea } from "../models/lineaModel.js";
import { getTipologiaByNombre, Tipologia } from "./tipologiaModel.js";
import sequelize from "../db.js";
import { DataTypes } from "sequelize";

export const Abertura = sequelize.define('abertura', {
  idabertura: { type: DataTypes.INTEGER, primaryKey: true },
  nombreabertura: DataTypes.STRING,
  ancho: DataTypes.INTEGER,
  alto: DataTypes.INTEGER,
  detalle: DataTypes.TEXT,
  cantidad: DataTypes.INTEGER,
  mosquitero: DataTypes.BOOLEAN,
  acoplamiento: DataTypes.BOOLEAN,
  numpresupuesto: DataTypes.INTEGER,
  idlinea: DataTypes.INTEGER,
  idtipologia: DataTypes.INTEGER,
  tipovidrio: DataTypes.STRING,
  estado: DataTypes.BOOLEAN,
}, { tableName: 'abertura', timestamps: false });

Abertura.hasMany(Presupuesto, {
  foreignKey: 'idabertura',
  onUpdate: 'CASCADE',
  timestamps: false
});

Presupuesto.hasOne(Abertura, {
  foreignKey: 'idabertura',
  onUpdate: 'CASCADE',
  timestamps: false
});

Linea.belongsTo(Abertura, {
  foreignKey: 'idlinea',
  onDelete: 'CASCADE'
});

Abertura.hasOne(Linea, {
  foreignKey: 'idlinea',
  onDelete: 'CASCADE'
});

Tipologia.belongsTo(Abertura, {
  foreignKey: 'idtipologia',
  onDelete: 'CASCADE'
});

Abertura.hasOne(Tipologia, {
  foreignKey: 'idtipologia',
  onDelete: 'CASCADE'
});

export const saveAbertura = async (aberturas, numpresupuesto) => {
  const pool = getPool();

  try {
    const maxidabertura = await getMaxId("idabertura", "abertura");
    let idabertura = maxidabertura + 1;

    // Construimos las filas para la inserción
    const values = await Promise.all(
      aberturas.map(async (abertura, index) => {
        const ancho = abertura.ancho ? parseFloat(abertura.ancho) : 0;
        const alto = abertura.alto ? parseFloat(abertura.alto) : 0;
        const cantidad = abertura.cantidad ? parseInt(abertura.cantidad) : 0;

        const idlinea =
          abertura.linea && abertura.color
            ? await getLineaByTipolinea(
              abertura.linea.toUpperCase(),
              abertura.color.toUpperCase()
            )
            : 0;

        const idtipologia = abertura.tipologia
          ? await getTipologiaByNombre(abertura.tipologia.toUpperCase())
          : 0;

        const tipovidrio = abertura.tipoVidrio || '';

        return [
          idabertura + index, // ID único
          abertura.id ? abertura.id : '', // Si no tiene ID, guardamos NULL
          ancho,
          alto,
          abertura.observaciones ? abertura.observaciones : '',
          cantidad,
          abertura.mosquitero ? abertura.mosquitero : null,
          abertura.acoplamiento ? abertura.acoplamiento : null,
          numpresupuesto,
          idlinea,
          idtipologia,
          tipovidrio,
        ];
      })
    );

    // Creando placeholders dinámicos
    const numCols = 12;
    const placeholders = values
      .map(
        (_, i) =>
          `(${Array.from(
            { length: numCols },
            (_, j) => `$${i * numCols + j + 1}`
          ).join(", ")})`
      )
      .join(", ");

    // Consulta SQL corregida
    const query = `
      INSERT INTO abertura (idabertura, nombreabertura, ancho, alto, detalle, cantidad, mosquitero, acoplamiento, numpresupuesto, idlinea, idtipologia, tipovidrio) 
      VALUES ${placeholders}
      RETURNING *;
    `;

    const flattenedValues = values.flat(); // Aplanamos los valores
    const result = await pool.query(query, flattenedValues);

    return result.rows; // Retornamos todas las filas insertadas
  } catch (error) {
    console.error("Error al guardar aberturas:", error);
    throw error;
  }
};


export const updateAbertura = async (abertura, idtipologia, idlinea) => {
  const pool = getPool();
  const queryAbert = `
    UPDATE abertura
    SET 
      nombreabertura = $2,
      ancho = $3,
      alto = $4,
      detalle = $5,
      cantidad = $6,
      mosquitero = $7,
      acoplamiento = $8,
      tipovidrio = $9,
      idlinea = $10,
      idtipologia = $11
    WHERE idabertura = $1
  `;

  try {
    await pool.query(queryAbert, [
      abertura.idabertura,
      abertura.nombreabertura,
      abertura.ancho,
      abertura.alto,
      abertura.detalle,
      abertura.cantidad,
      abertura.mosquitero,
      abertura.acoplamiento,
      abertura.tipovidrio,
      idlinea,
      idtipologia
    ])

    return { message: "Abertura modificada" }
  } catch (error) {
    console.log("Error en: ", error);
    throw error;
  }
};
