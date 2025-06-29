import axios from "axios";
import { urlBackend } from "../App";
// Función para obtener los usuarios desde el backend
export const fetchUsuarios = async (setUsuarios) => {
    try {
      const response = await axios.get(`${urlBackend}/usuario`, {
        withCredentials: true, // Enviar cookies automáticamente
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

// handleDeactivateUser.js
export const handleDeactivateUser = (dni, setSelectedUserDni, setShowConfirmation) => {
  setSelectedUserDni(dni); // Establecer el DNI seleccionado
  setShowConfirmation(true); // Mostrar la confirmación
};

// handleConfirmDeactivate.js
export const handleConfirmDeactivate = async (
  selectedUserDni,
  password,
  setShowConfirmation,
  setPassword,
  fetchUsuarios
) => {
  try {
    if (!selectedUserDni || !password) return; // Validar que no falten datos

    const response = await axios.put(
      `${urlBackend}/usuarioInactive`,
      {
        dni: selectedUserDni,
        estado: false, // Cambiar el estado del usuario a inactivo
        contrasenia: password, // Contraseña para autenticar la desactivación
      },
      {
        withCredentials: true, // Asegurar que las cookies se envíen
      }
    );

    console.log("Respuesta del servidor:", response.data);
    fetchUsuarios(); // Recargar la lista de usuarios después de la desactivación
    setShowConfirmation(false); // Ocultar el modal de confirmación
    setPassword(""); // Limpiar el campo de contraseña
  } catch (error) {
    console.error("Error al desactivar al usuario:", error);
  }
};
