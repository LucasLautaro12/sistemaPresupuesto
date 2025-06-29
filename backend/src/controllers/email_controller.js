import { getCorreoByDni } from "../models/usuarioModel.js";
import { sendMail } from "../service/emailService.js";

export const enviarCorreo = async (req, res) => {
  //const {destinatario, asunto, cuerpo } = req.body;
  const archivos = req.files;
  const { usuario, correo } = req.body;
  
  //const dni = usuario.dni;
  const dni = '12341234';
  try {
    const remitente = await getCorreoByDni(parseInt(dni));
    //const destinatario = correo;
    const destinatario = "lautarozzzz12@gmail.com"
    const asunto = "Ejemplo para enviar correo";
    const cuerpo =
      "Lorem ipsum is a dummy text used in laying out print, graphic or web designs. It is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.";

    const archivosAdjuntos = archivos.map((archivo) => ({
      filename: archivo.originalname,
      path: archivo.path,
    }));

    await sendMail(remitente, destinatario, asunto, cuerpo, archivosAdjuntos);
    res.status(200).json({ message: "Correo enviado con exito." });
  } catch (error) {
    res.status(500).json({ message: "Correo enviado con exito." });
  }
};
