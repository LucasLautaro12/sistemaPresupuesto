
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { getRolByName } from "../models/rolModel.js";
import { Persona } from "../models/personaModel.js";
import { Usuario } from "../models/usuarioModel.js";

const TOKEN_SECRET = process.env.TOKEN_SECRET;

//Petición GET 
//Probar
export const usuario = async (req, res) => {
  try {
    // Obtén los usuarios de la base de datos
    const usuarios = await Usuario.findAll();

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
//Probar
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
    const contraseniaHash = await Persona.findAll(idpersona);

    // Verificar que la contraseña proporcionada coincida con el hash
    const coincide = bcrypt.compare(contrasenia, contraseniaHash);
    if (!coincide) {
      return res.status(403).json({ message: "Contraseña incorrecta." });
    }

    // Cambiar el estado del usuario
    const usuarios = await Usuario.update(
      { estado },
      {
        where: {
          dni
        }
      }
    );

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

//Peticion GET
//Probar
export const responsables = async (req, res) => {
  try {
    const usuariosResponsables = await Usuario.findAll({
      attributes: ['dni'],
      include: [
        {
          model: Persona,
          attributes: ['apellido', 'nombre'],
        },
      ],
      order: [['dni', 'ASC']]
    });

    const nombresCompletos = usuariosResponsables.map((user) => {
      const { apellido, nombre } = user.persona; // acceder al include
      return `${apellido} ${nombre}`;
    });

    res.json({ nombresCompletos });
  } catch (error) {
    console.error("Error al obtener los responsables:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//Peticion PATCH
//Probar
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
    await Usuario.update({ nombre, apellido, correo, departamento, rolesArray, permisosMap }, { where: { dni } })
    return res
      .status(200)
      .json({ message: "Usuario actualizado exitosamente." });
  } catch (error) {
    console.error(error);
    throw error;
  }
};



