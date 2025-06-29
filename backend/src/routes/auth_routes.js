import { Router } from "express";
import {
  login,
  register,
  logout,
  verify,
} from "../controllers/auth_controller.js";
import { auth } from "../middlewares/auth.js";
import { verificarPermiso } from "../middlewares/verificarPermiso.js";

const router = Router();

// Desarrollo listo
router.post("/register", auth, verificarPermiso(["ADMIN","CREAR_USER"]), register);

// Desarrollo listo
router.post("/login", login);

// Desarrollo listo
router.post("/logout", logout);

// Desarrollo listo
router.post("/verify", verify);

export default router;
