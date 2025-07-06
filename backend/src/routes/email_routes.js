//email_rutes.js

import { Router } from "express";
import multer from "multer";
import { enviarCorreo } from "../controllers/email_controller.js";
import { previewpdf } from "../controllers/pdf_controller.js";

const router = Router();

const upload = multer({ dest: "uploads/" });

// Desarrollo listo (Falta conectar con el front)
router.post("/enviarCorreo", upload.array("archivos"), enviarCorreo);

router.get("/previewpdf", previewpdf);

export default router;
