import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { urlBackend } from "../App";

export const login = async (
  dni,
  contrasenia,
  setMessage,
  onLogin,
  navigate
) => {
  try {
    const response = await axios.post(
      `${urlBackend}/login`,
      { dni, contrasenia },
      { withCredentials: true }
    );
    const token = response.data.token;

    if (token) {
      localStorage.setItem("token", token);

      // Decodifica para ver el contenido (debug)
      const decoded = jwtDecode(token);
      console.log("Token decodificado:", decoded);

      setMessage("Login exitoso");
      onLogin(true);
      navigate("/home");

      // Retorna el token para actualizar el contexto desde el componente
      return token;
    } else {
      setMessage("No se recibió token.");
      onLogin(false);
      return null;
    }
  } catch (error) {
    setMessage(error.response?.data?.message || "Error en el inicio de sesión");
    onLogin(false);
    return null;
  }
};
