import axios from "axios";
import { urlBackend } from "../App";

// Función para cerrar sesión
export const handleLogout = async (navigate) => {
  try {
    await axios.post(
      `${urlBackend}/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    localStorage.removeItem("token");
    navigate("/");
  } catch (error) {
    console.error("Error en logout:", error.response?.data || error.message);
  }
};
