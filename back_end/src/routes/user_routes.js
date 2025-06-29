import { Router } from "express";
import { usuario, usuarioInactive, modificarusuario, responsables } from "../controllers/user_controller.js";
import { auth } from "../middlewares/auth.js";
import { verificarPermiso } from "../middlewares/verificarPermiso.js";

const router = Router();

//Rutas de la vista usuario.
// Desarrollo listo
router.get("/usuario", auth, verificarPermiso(["ADMIN","LEER_PM_USER"]), usuario);

// Desarrollo listo 
router.put("/usuarioInactive", auth, verificarPermiso(["ADMIN","ELIMINAR_USER"]), usuarioInactive);

// Desarrollo listo
router.get("/responsables", auth, responsables)

// Desarrollo falta
router.patch("/modificarusuario", auth, verificarPermiso(["ADMIN","MODIFICAR_USER"]), modificarusuario);

// Desarrollo listo
router.get("/profile", auth, (req, res) => {
    const { nombre, apellido } = req.user; // Obtener los datos del usuario desde el token
    //const {nombre, apellido} = {nombre: 'anonimo' , apellido: 'vexar'};
    res.json({ nombre, apellido }); // Devolver los datos
  });

export default router;