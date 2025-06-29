import axios from "axios";
import { urlBackend } from "../App";
// Función para obtener el perfil del usuario
export const fetchProfile = async (setUserName, handleLogout) => {
    try {
      const response = await axios.get(`${urlBackend}/profile`, {
        withCredentials: true,
      });
      const { nombre, apellido } = response.data;
      setUserName(`${nombre} ${apellido}`);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        console.error("Error al obtener el perfil:", error.message);
      }
    }
  };
  