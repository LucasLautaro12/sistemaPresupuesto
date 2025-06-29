import axios from "axios";
import { urlBackend } from "../App";
import { jwtDecode } from "jwt-decode";

export const modificarCliente = async (celular, cliente, correo) => { 
  const response = await axios.patch(
    `${urlBackend}/modificarcliente`,
    { celular, cliente, correo },
    {
      withCredentials: true, // Asegurar que las cookies se envíen
    }
  );
};

export const modificarPresupuesto = async (presupuesto, usuario) => {
  const response = await axios.put(
    `${urlBackend}/modificarpresupuesto`,
    { presupuesto, usuario },
    {
      withCredentials: true, // Asegurar que las cookies se envíen
    }
  );
};

export const modificarAbertura = async (abertura) => {
  const response = await axios.put(
    `${urlBackend}/modificarabertura`,
    { abertura },
    {
      withCredentials: true, // Asegurar que las cookies se envíen
    }
  );
};

export const modificarArchivos = async (numPresupuesto, archivos) => {
  const formData = new FormData();

  formData.append("numPresupuesto", numPresupuesto); // Agregar numPresupuesto al FormData

  archivos.forEach((archivo) => {
    formData.append("archivos", archivo.file); // Agregar cada archivo al FormData
  });

  const response = await axios.put(
    `${urlBackend}/modificararchivos`,
    formData,
    {
      withCredentials: true, // Asegurar que las cookies se envíen
      headers: {
        "Content-Type": "multipart/form-data", // Indicar que se están enviando archivos
      },
    }
  );

  return response.data;
};

export const modificarMonto = async (monto, numpresupuesto) => {
  const token = localStorage.getItem("token");
  try {
    let usuario = null;
  if (token) {
    usuario = jwtDecode(token);
  }

  const response = await axios.put(
    `${urlBackend}/modificarmonto`,
    { monto, numpresupuesto, usuario },
    {
      withCredentials: true, // Asegurar que las cookies se envíen
    }
  );
  } catch (error) {
    console.error("Error al mandar el monto.", error)
    throw(error)
  }
};

export const modificarMontoCerrado = async (montocerrado, numpresupuesto) => {
  const token = localStorage.getItem("token");
  try {
    let usuario = null;
    if (token) {
      usuario = jwtDecode(token);
    }
    const response = await axios.put(
      `${urlBackend}/modificarmontocerrado`,
      { montocerrado, numpresupuesto, usuario },
      {
        withCredentials: true, // Asegurar que las cookies se envíen
      }
    );
  } catch (error) {
    console.error("Error al mandar el monto cerrado.", error);
    throw error;
  }
};

export const eliminarArchivos = async (archivoAEliminar, numPresupuesto) => {
  try {
    const response = await axios.delete(`${urlBackend}/eliminararchivos`, {
      headers: { "Content-Type": "application/json" },
      data: { archivoAEliminar, numPresupuesto },
      withCredentials: true,
    });

    if (response.status === 200) {
      setArchivos(archivos.filter((_, i) => i !== index));
    } else {
      console.error("Error al eliminar el archivo");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
};
