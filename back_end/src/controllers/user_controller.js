import {
  changeState,
  getContraseniaById,
  getResponsables,
  getTodosUsuarios,
  updateUsuario,
} from "../models/usuarioModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { getRolByName } from "../models/rolModel.js";

const TOKEN_SECRET = process.env.TOKEN_SECRET;

//Petición GET 
export const usuario = async (req, res) => {
  try {
    // Obtén los usuarios de la base de datos
    const usuarios = await getTodosUsuarios();

    // Verifica si no hay usuarios
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }

    // Filtra y formatea los usuarios para enviar solo los datos necesarios
    const usuariosFiltrados = usuarios.map((usuario) => ({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      dni: usuario.dni,
      deoartamento: usuario.deoartamento,
      roles: usuario.roles,
      permisos: usuario.permisos,
    }));

    // Envía los usuarios filtrados como respuesta
    return res.json(usuariosFiltrados);
  } catch (error) {
    // Manejo de errores si algo sale mal
    console.error("Error al obtener los usuarios:", error);
    return res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
};

// Petición PUT
export const usuarioInactive = async (req, res) => {
  try {
    // Extraer el token desde las cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado." });
    }

    // Verificar el token
    const decode = jwt.verify(token, TOKEN_SECRET);

    const { dni, estado, contrasenia } = req.body;

    const idpersona = decode.idpersona;

    // Obtener la contraseña hasheada asociada al usuario
    const contraseniaHash = await getContraseniaById(idpersona);

    // Verificar que la contraseña proporcionada coincida con el hash
    const coincide = await bcrypt.compare(contrasenia, contraseniaHash);
    if (!coincide) {
      return res.status(403).json({ message: "Contraseña incorrecta." });
    }

    // Cambiar el estado del usuario
    const usuarios = await changeState(dni, estado);

    return res
      .status(200)
      .json({ message: "Estado del usuario actualizado exitosamente." });
  } catch (error) {
    // Manejo de errores si algo sale mal
    console.error("Error al procesar la solicitud:", error);
    return res.status(500).json({
      message: "Error al procesar la solicitud.",
    });
  }
};

//Peticion PATCH
export const modificarusuario = async (req, res) => {
  const { dni } = req.body;
  const { nombre, apellido, correo, departamento, roles } =
    req.body.updatedData;

  // Para manejar múltiples roles
  const rolesArray = [];
  const permisosMap = [];

  for (const [rolNombre, permisos] of Object.entries(roles)) {
    try {
      const rolId = await getRolByName([rolNombre]); // Asegúrate de que se pasa como array
      rolesArray.push(rolId[0]);
      permisosMap.push(permisos);
    } catch (error) {
      console.error(`Error al obtener el ID del rol '${rolNombre}':`, error);
    }
  }
  try {
    await updateUsuario(dni, nombre, apellido, correo, departamento, rolesArray, permisosMap)
    return res
      .status(200)
      .json({ message: "Usuario actualizado exitosamente." });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Peticion GET
export const responsables = async (req, res) => {
  try {
    const usuariosResponsables = await getResponsables();

    const nombresCompletos = usuariosResponsables.map(
      (user) => `${user.apellido} ${user.nombre}`
    );

    res.json({ nombresCompletos });
  } catch (error) {
    console.error("Error al obetner los responsables: ", error);
    throw error;
  }
};
