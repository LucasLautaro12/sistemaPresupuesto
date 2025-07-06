//pres_roueter.js
import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import {
  formpresupuesto,
  presupuesto,
  modificarpresupuesto,
  modificarmonto,
  modificarmontocerrado,
} from "../controllers/pres_controller.js";
import multer from "multer";
import { verificarPermiso } from "../middlewares/verificarPermiso.js";
import { modificarcliente } from "../controllers/clietn_controller.js";
import { agregarabertura, modificarabertura } from "../controllers/abertura_controller.js";
import { eliminararchivos, modificararchivos } from "../controllers/archivo_controller.js";

/* import { lista_perfil } from '../controllers/pres_controller.js' */
const upload = multer({ dest: "uploads/" });
//1:20:36

const router = Router();

// Desarrollo listo
router.get("/presupuesto", auth, verificarPermiso(["ADMIN", "LEER_PM_PRES"]), presupuesto);

// Desarrollo listo
router.post("/formpresupuesto", auth, verificarPermiso(["ADMIN", "CREAR_PRES"]), upload.array("archivos"), formpresupuesto);

// Desarrollo listo
router.patch("/modificarcliente", auth, verificarPermiso(["ADMIN", "MODIFICAR_PM_PRES"]), modificarcliente);

// Desarrollo listo
router.put("/modificarpresupuesto", auth, verificarPermiso(["ADMIN", "MODIFICAR_PM_PRES"]), modificarpresupuesto);

// Desarrollo listo
router.put("/modificarabertura", auth, verificarPermiso(["ADMIN", "MODIFICAR_PM_PRES"]), modificarabertura);

// Desarrollo listo
router.put("/modificararchivos", auth, verificarPermiso(["ADMIN", "MODIFICAR_PM_PRES"]), upload.array("archivos"), modificararchivos);

// Desarrollo listo 
router.delete("/eliminararchivos", auth, verificarPermiso(["ADMIN", "MODIFICAR_PM_PRES"]), eliminararchivos)

// Desarrollo listo
router.put("/modificarmonto", auth, verificarPermiso(["ADMIN", "MODIFICAR_MONTO_PRES"]), modificarmonto);

// Desarrollo listo
router.put("/modificarmontocerrado", auth, verificarPermiso(["ADMIN", "MODIFICAR_MONTOCERRADO_PRES"]), modificarmontocerrado);

// Desarrollo falta
router.post("/agregarnuevaabertura",  auth, verificarPermiso(["ADMIN", "MODIFICAR_PM_PRES"]), agregarabertura)

export default router;
