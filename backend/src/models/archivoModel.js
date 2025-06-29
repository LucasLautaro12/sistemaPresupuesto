//import { getPool } from "../db.js";
//import cloudinary from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

class Archivo {
  constructor(
    idarchivo,
    url,
    nombreoriginal,
    tipoarchivo,
    fechasubida,
    numpresupuesto
  ) {
    this.idarchivo = idarchivo;
    this.url = url;
    this.nombreoriginal = nombreoriginal;
    this.tipoarchivo = tipoarchivo;
    this.fechasubida = fechasubida;
    this.numpresupuesto = numpresupuesto;
  }
}

export default Archivo;

//Guardar Archivos
export const saveArchivos = async (numpresupuesto, archivos) => {
  const pool = getPool();
  const client = await pool.connect();

  // Query para insertar un archivo
  const queryArchivo = `INSERT INTO archivo (url, nombreoriginal, tipoarchivo, fechasubida, public_id) 
                     VALUES ($1, $2, $3, NOW(), $4) RETURNING idarchivo;`;

  // Query para insertar la relación archivo-presupuesto
  const queryPresArc = `INSERT INTO archivopresupuesto (idarchivo, numpresupuesto) VALUES ($1, $2);`;

  try {
    await client.query("BEGIN"); // Inicia la transacción
    const results = [];

    // Itera sobre cada archivo en la lista de archivos
    for (const [nombre, url, public_id] of archivos) {
      const tipoArchivo = url.endsWith(".pdf") ? "PDF" : "Imagen"; // Determina el tipo de archivo
      console.log(public_id)
      // Inserta en la tabla archivo y obtiene el idarchivo generado
      const result = await client.query(queryArchivo, [
        url, // URL del archivo
        nombre, // Nombre original del archivo
        tipoArchivo, // Tipo de archivo
        public_id
      ]);

      const idarchivo = result.rows[0].idarchivo;

      // Inserta en la tabla archivopresupuesto asociando el archivo con el presupuesto
      await client.query(queryPresArc, [idarchivo, numpresupuesto]);

      results.push({ idarchivo, url, nombre, tipoArchivo });
    }

    await client.query("COMMIT"); // Confirma la transacción
    return results;
  } catch (error) {
    await client.query("ROLLBACK"); // Revierte la transacción en caso de error
    console.error("Error en saveArchivos:", error);
    throw error;
  } finally {
    client.release(); // Libera el cliente
  }
};

export const deleteArchivo = async (idArchivo, numPresupuesto) => {
  const pool = getPool();
  const client = await pool.connect();

  // Consultas SQL
  const queryArchivo = `SELECT public_id FROM archivo WHERE idarchivo = $1`;
  const queryArchPres = `DELETE FROM archivopresupuesto WHERE idarchivo = $1 AND numpresupuesto = $2;`;
  const queryEliminarArchivo = `DELETE FROM archivo WHERE idarchivo = $1;`;

  try {
    await client.query('BEGIN'); // Iniciar la transacción

    // 1. Obtener el public_id del archivo en Cloudinary
    const archivo = await client.query(queryArchivo, [idArchivo]);
    if (archivo.rowCount === 0) {
      throw new Error('No se encontró el archivo con ese ID.');
    }
    const publicId = archivo.rows[0].public_id;

    // 2. Eliminar el archivo de Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);
    if (cloudinaryResponse.result !== "ok") {
      throw new Error('No se pudo eliminar el archivo de Cloudinary.');
    }
    console.log(`Archivo ${publicId} eliminado de Cloudinary`);

    // 3. Eliminar la relación en archivopresupuesto
    const resultArchPres = await client.query(queryArchPres, [idArchivo, numPresupuesto]);
    if (resultArchPres.rowCount === 0) {
      throw new Error('No se encontró el archivo asociado al presupuesto.');
    }

    // 4. Eliminar el archivo de la base de datos
    const resultArch = await client.query(queryEliminarArchivo, [idArchivo]);
    if (resultArch.rowCount === 0) {
      throw new Error('No se encontró el archivo con ese ID.');
    }

    await client.query('COMMIT'); // Confirmar la transacción
    console.log("Archivo y su asociación con presupuesto eliminados correctamente.");
    
    return { success: true, message: "Archivo eliminado correctamente." };
  } catch (error) {
    await client.query('ROLLBACK'); // Revertir la transacción en caso de error
    console.error("Error al eliminar el archivo:", error.message);
    return { success: false, message: error.message };
  } finally {
    client.release(); // Liberar el cliente
  }
};


