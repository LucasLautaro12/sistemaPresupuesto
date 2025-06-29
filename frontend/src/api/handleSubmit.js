// handleSubmit.js
import axios from "axios";
import { urlBackend } from "../App";

export const handleSubmit = async (formData, updateFormData, navigate) => {
  try {
    // Actualizar el estado del usuario en el contexto antes de enviar
    const updatedFormData = {
      ...formData,
      user: {
        ...formData.user,
        estado: true, // Asignar estado `true` al usuario
      },
    };

    updateFormData(updatedFormData); // Actualizar el estado global

    // Enviar los datos actualizados al backend
    const response = await axios.post(
      `${urlBackend}/register`,
      updatedFormData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Por si el backend utiliza cookies
      }
    );

    console.log("Datos enviados correctamente:", response.data);
    navigate("/usuario"); // Redirigir a la página de inicio después del éxito
  } catch (error) {
    console.error("Error al enviar los datos:", error);
    if (error.response) {
      console.error("Respuesta del servidor:", error.response.data);
    }
    alert("Hubo un error al enviar los datos. Por favor, intenta nuevamente.");
  }
};
