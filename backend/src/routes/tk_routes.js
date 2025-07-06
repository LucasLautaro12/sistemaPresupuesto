//tk_routes.js

import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { verificarPermiso } from "../middlewares/verificarPermiso.js";
import { ticket, creartk } from "../controllers/tk_controller.js";

const router = Router();

router.get("/ticket", /* auth, verificarPermiso(["ADMIN","LEER_PM_TK"]), */ ticket);

router.post("/creartk", /* auth, verificarPermiso(["ADMIN","CREAR_TK"]), */ creartk);

export default router;