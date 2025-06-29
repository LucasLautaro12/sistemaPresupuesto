import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "anonimovexar@gmail.com",
    pass: "nhhw xhks dvil kfgh",
  },
});

export const sendMail = async (from, to, subject, text, attachments) => {
  try {
    const mailOptions = {
      from,
      to,
      subject,
      text,
      attachments,
    };
    const info = await transport.sendMail(mailOptions);
    console.log("Correo enviado: ", info.response);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo: ", error);
    throw error;
  }
};