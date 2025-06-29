import axios from "axios";
import { urlBackend } from "../App";

export const updateUser = async (dni, updatedData) => {
  try {
    await axios.patch(`${urlBackend}/modificarusuario`, {dni, updatedData}, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return { success: true, message: "Usuario actualizado con éxito" };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return { success: false, message: "Error al actualizar usuario" };
  }
};
