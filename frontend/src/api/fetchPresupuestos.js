// src/api/presupuestoActions.js (Si no usas TypeScript)
import axios from "axios";
import { urlBackend } from "../App";
import { jwtDecode } from "jwt-decode";

export const fetchPresupuestos = async (
  setPresupuestos,
  setData,
  setLoading,
  setError
) => {
  try {
    setLoading(true);
    const response = await axios.get(`${urlBackend}/presupuesto`, {
      withCredentials: true, // Enviar cookies automáticamente
    });
    setPresupuestos(response.data);
    setData(response.data); // Aquí se asignan los datos del backend a la variable `data`
    setLoading(false);
  } catch (err) {
    console.error("Error al obtener los presupuestos:", err);
    setError("Error al cargar los datos.");
    setLoading(false);
  }
};

export const crearPresupuesto = async (formDataToSend) => {
  const token = localStorage.getItem("token");
  try {
    let usuario = null;
    if (token) {
      usuario = jwtDecode(token);
      console.log("Usuario autenticado:", usuario);
      formDataToSend.append("usuario", JSON.stringify(usuario));
    }

    // Realizamos el envío de los datos al backend
    await axios.post(`${urlBackend}/formpresupuesto`, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data", // Especificamos que estamos enviando un formulario con archivos
      },
      withCredentials: true,
    });
  } catch (error) {
    console.error("error en crearPresupuesto fron: ", error);
    throw error;
  }
};

export const enviarMail = async () => {
  const token = localStorage.getItem("token");
  try {
    let usuario = null;
    if (token) {
      usuario = jwtDecode(token);
      console.log("Usuario autenticado:", usuario);
      formDataToSend.append("usuario", JSON.stringify(usuario));
    }

    // Realizamos el envío de los datos al backend
    await axios.post(`${urlBackend}/formpresupuesto`, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data", // Especificamos que estamos enviando un formulario con archivos
      },
      withCredentials: true,
    });
  } catch (error) {
    console.error("error en crearPresupuesto fron: ", error);
    throw error;
  }
} 

export const agregarAbertura = async (abertura, numPresupuesto) =>{
  try {
    await axios.post(`${urlBackend}/agregarnuevaabertura`, {abertura, numPresupuesto}, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error al cargar la abertura: ",error)
  }
};
