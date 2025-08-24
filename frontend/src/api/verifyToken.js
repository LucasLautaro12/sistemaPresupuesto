import axios from "axios";
import { urlBackend } from "../App";

export const verifyToken = async (setIsAuthenticated, setLoading) => {
  try {
    // No enviamos token, axios enviará las cookies automáticamente
    const response = await axios.get(`${urlBackend}/verify`, {
      withCredentials: true, // IMPORTANTE para enviar cookies
    });

    if (response.status === 200) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  } catch (error) {
    console.error("Error al verificar el token:", error);
    setIsAuthenticated(false);
  } finally {
    setLoading(false);
  }
};
