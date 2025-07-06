import * as fs from "fs/promises";
import path from "path";
import moment from "moment";

import { uploadFile, uploadImage } from "../config/cloudinaryService.js";
import { transformResult } from "../service/presupuestoService.js";
import { saveArchivos } from "../models/archivoModel.js";
import { saveAbertura } from "../models/aberturaModel.js";

export const presupuesto = async (req, res) => {
  try {
    const presupuestos = await transformResult();
    return res.json(presupuestos);
  } catch (error) {
    console.error("Error al obtener los presupuestos:", error);
    return res.status(500).json({
      message: "Error al obtener los presupuestos",
    });
  }
};

async function subirArchivo(archivo) {
  const fileExtension = path.extname(archivo.originalname); // Obtiene la extensión del archivo (por ejemplo, .pdf)
  const baseName = path.basename(archivo.originalname, fileExtension); // Obtiene el nombre base sin extensión

  if (archivo.mimetype.startsWith("image/")) {
    console.log(`Subiendo imagen: ${archivo.originalname}`);
    return await uploadImage(archivo.path, archivo.originalname);
    // return { nombre: archivo.originalname, url: "linkImg" };
  } else if (archivo.mimetype === "application/pdf") {
    console.log(`Subiendo archivo PDF: ${archivo.originalname}`);
    return await uploadFile(archivo.path, archivo.originalname);
    // return { nombre: archivo.originalname, url: "linkPDF" };
  } else {
    throw new Error(`Tipo de archivo no soportado: ${archivo.mimetype}`);
  }
}

export const procesarArchivos = async (archivos) => {
  const archivoUrls = await Promise.all(
    archivos.map(async (archivo) => {
      try {
        const result = await subirArchivo(archivo); // Subimos el archivo y obtenemos la URL
        return [archivo.originalname, result.url, result.public_id]; // Retornamos un array con el nombre y la URL del archivo
      } catch (error) {
        console.error(
          `Error con el archivo ${archivo.originalname}:`,
          error
        );
        return null; // Si hay un error, devolvemos null para filtrarlo después
      }
    })
  );

  // Filtramos los archivos fallidos (nulls) para que no se incluyan en la respuesta
  const urlsFiltradas = archivoUrls.filter(Boolean);

  // Eliminamos los archivos temporales del servidor
  await Promise.all(archivos.map((archivo) => fs.unlink(archivo.path)));

  return urlsFiltradas;
};

export const formpresupuesto = async (req, res) => {
  try {
    // Función para convertir los valores del objeto en JSON si es necesario
    const parsearDatos = (datos) =>
      Object.fromEntries(
        Object.entries(datos).map(([key, value]) => {
          try {
            return [key, JSON.parse(value)]; // Intenta convertir el valor en un objeto JSON
          } catch {
            return [key, value]; // Si falla, deja el valor original (ya es un objeto o string normal)
          }
        })
      );

    // Convertimos los datos del body en objetos si es necesario
    const datosProcesados = parsearDatos(req.body);
    const { cliente, presupuesto, abertura, usuario} = datosProcesados;
    const archivos = req.files || []; // Si no hay archivos, dejamos un array vacío para evitar errores
    
    try {
      // Aquí puedes guardar el presupuesto y abertura en la base de datos
      const numpresupuestoGuardado = await savePresupuesto(
        cliente,
        presupuesto,
        usuario
      );

      // todo lo de arriba ok
      if (abertura){
        await saveAbertura(abertura, numpresupuestoGuardado);
      }

      // Mapeamos los archivos para subirlos y obtenemos sus URLs
      const urlsFiltradasFun = await procesarArchivos(archivos)

      // Aquí puedes guardar la información de los archivos en la base de datos
      await saveArchivos(numpresupuestoGuardado, urlsFiltradasFun);
      res.json({ message: "Archivos subidos con éxito", urls: urlsFiltradasFun });
    } catch (error) {
      console.error("Error al subir los archivos:", error);
      res
        .status(500)
        .json({ message: "Error al procesar la solicitud", error });
    }
  } catch (error) {
    console.error("Error al procesar los datos:", error);
    res.status(500).json({ message: "Error al convertir los datos" });
  }
};

export const modificarpresupuesto = async (req, res) => {
  //convertir todo a numero
  try {
    const {
      numPresupuesto,
      estado,
      ubicacion,
      okTecnico,
      fechaInicio,
      urgencia,
      fechaGanada,
      nota,
    } = req.body.presupuesto;

    const fechainicio = moment(fechaInicio, "DD-MM-YYYY").format("YYYY-MM-DD");

    const presupuesto = new Presupuesto(
      parseInt(numPresupuesto),
      fechainicio,
      urgencia,
      nota ? nota : "",
      okTecnico,
      estado,
      fechaGanada ? fechaGanada : null,
      ubicacion
    );

    await updatePresupuesto(presupuesto);

    return res.json({
      message: "Presupuesto modificado correctamente",
    });
  } catch (error) {
    console.error("Error al modificar el presupuesto: ", error);
  }
};

export const modificarmonto = async (req, res) => {
  
  const { monto, numpresupuesto, usuario } = req.body;
  
  const montopresupuestado = parseFloat(monto)
  const numeropresupuesto = parseInt(numpresupuesto)

  const query = `
  UPDATE presupuesto
  SET monto = $2
  WHERE numpresupuesto = $1;`;
  const responsable = 'PRESUPUESTADOR';

  try {
    const result = await updateMonto(montopresupuestado, numeropresupuesto, usuario, query, responsable)
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error inesperado en la actualización del monto:", error);
    res
      .status(500)
      .json({
        message: "Ocurrió un error al actualizar el monto.",
        error: error.message,
      });
  }
};

export const modificarmontocerrado = async (req, res) => {

  const { montocerrado, numpresupuesto, usuario } = req.body;

  const monto = parseFloat(montocerrado)
  const numeropresupuesto = parseInt(numpresupuesto)

  const query = `
  UPDATE presupuesto
  SET montocerrado = $2
  WHERE numpresupuesto = $1;`;

  const responsable = 'FINALIZADOR';

  try {
    const result = await updateMonto(monto, numeropresupuesto, usuario, query, responsable)
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error inesperado en la actualización del monto:", error);
    res
      .status(500)
      .json({
        message: "Ocurrió un error al actualizar el monto.",
        error: error.message,
      });
  }
};
