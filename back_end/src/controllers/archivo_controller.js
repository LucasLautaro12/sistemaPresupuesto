import { deleteArchivo, saveArchivos } from "../models/archivoModel.js";
import { procesarArchivos } from "./pres_controller.js";

export const modificararchivos = async (req, res) => {
  try {
    const numPresupuesto = req.body.numPresupuesto; // Obtener el número de presupuesto
    const archivos = req.files; // Obtener los archivos subidos
    // Mapeamos los archivos para subirlos y obtenemos sus URLs
    const urlsFiltradasFun = await procesarArchivos(archivos);
    // Aquí puedes guardar la información de los archivos en la base de datos
    await saveArchivos(numPresupuesto, urlsFiltradasFun);

    res.status(200).json({
      message: "Presupuesto modificado con éxito",
      numPresupuesto,
      files: archivos,
    }); 
  } catch (error) {
    console.error("Error al modificar el presupuesto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const eliminararchivos = async (req, res) => {
  const { archivoAEliminar, numPresupuesto } = req.body;

  const idarchvio = archivoAEliminar.idarchivo;
  const numPres = parseInt(numPresupuesto);

  try {
    await deleteArchivo(idarchvio,numPres);
    res.json({ message: "archivo eliminado" });
  } catch (error) {
    console.error(error)
    throw(error)
  }
};
