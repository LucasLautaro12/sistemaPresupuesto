import Abertura, {
  saveAbertura,
  updateAbertura,
} from "../models/aberturaModel.js";
import { getLineaByTipolinea } from "../models/lineaModel.js";
import { getTipologiaByNombre } from "../models/tipologiaModel.js";

export const modificarabertura = async (req, res) => {
  //convertir todo a numero
  const {
    idAbertura,
    nombretipologia,
    nombreAbertura,
    ancho,
    alto,
    cantidad,
    tipolinea,
    tipovidrio,
    color,
    mosquitero,
    acoplamiento,
    detalle,
  } = req.body.abertura;
  const abertura = new Abertura(
    idAbertura,
    nombreAbertura,
    ancho,
    alto,
    detalle,
    cantidad ? cantidad : 0,
    mosquitero,
    acoplamiento,
    tipovidrio
  );
  const idtipologia = nombretipologia
    ? await getTipologiaByNombre(nombretipologia)
    : 0;

  const idlinea =
    tipolinea && color ? await getLineaByTipolinea(tipolinea, color) : 0;

  try {
    console.log(abertura);
    await updateAbertura(abertura, idtipologia, idlinea);
    return res.json({
      message: "Presupuesto modificado correctamente",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const agregarabertura = async (req, res) => {
  try {
    const { abertura, numPresupuesto } = req.body;
    
    await saveAbertura(abertura, parseInt(numPresupuesto));
    return res.json({
      message: "Abertura cargada correctamente"
    })
  } catch (error) {
    console.error("Errro al guardar la abertura: ", error);
  }
  
};
