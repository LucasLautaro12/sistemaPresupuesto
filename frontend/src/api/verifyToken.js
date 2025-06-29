import axios from "axios";
import { urlBackend } from "../App";

export const verifyToken = async (token, setIsAuthenticated, setLoading) => {
  try {
    const response = await axios.post(
      `${urlBackend}/verify`,
      { token },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      setIsAuthenticated(true);
    }
  } catch (error) {
    console.error("Error al verificar el token:", error); // Depuración
    setIsAuthenticated(false);
    localStorage.removeItem("token"); // Eliminar token inválido
  } finally {
    setLoading(false);
  }
};
