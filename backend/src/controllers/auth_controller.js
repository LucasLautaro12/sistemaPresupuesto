import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
/* import { TOKEN_SECRET } from "../config.js"; */
import { createAccessToken } from "../libs/jwt.js";

import "dotenv/config";
import { Usuario } from "../models/usuarioModel.js";
import { Persona } from "../models/personaModel.js";

const TOKEN_SECRET = process.env.TOKEN_SECRET;

//Peticiones POST
//Probar
export const register = async (req, res) => {
  try {
    const { user, roles, department, permissions } = req.body;
    const { apellido, nombre, dni, correo, contrasenia1, estado } = user;

    // Verificamos si el usuario ya existe
    const usuarioExistente = await Usuario.findByPk(parseInt(dni));
    if (usuarioExistente) {
      return res.status(400).json({ message: "El DNI ya está registrado." });
    }

    // Calculamos el próximo ID de persona
    const maxIdPersona = await Persona.max('idpersona');
    const idpersona = (maxIdPersona || 0) + 1;

    // Creamos la persona
    await Persona.create({
      idpersona,
      apellido,
      nombre,
      correo: correo || ''
    });

    // Encriptamos la contraseña
    const contraseniaHash = await bcrypt.hash(contrasenia1, 10);

    // Creamos el usuario
    const nuevoUsuario = await Usuario.create({
      dni,
      contrasenia: contraseniaHash,
      idpersona,
      estado,
      departamento: department,
      primer_ingreso: true
    });

    // Obtenemos el ID del rol
    const rol = await Rol.findOne({ where: { nombrerol: roles } });
    if (!rol) return res.status(404).json({ message: 'Rol no encontrado' });

    await Usuariorol.create({
      dni,
      idrol: rol.idrol
    });

    // Si hay permisos, los asociamos (opcional)
    if (permissions && permissions.length > 0) {
      for (const permisoNombre of permissions) {
        const permiso = await Permiso.findOne({ where: { nombre: permisoNombre } });
        if (permiso) {
          await Usuariopermiso.create({
            dni,
            idpermiso: permiso.idpermiso
          });
        }
      }
    }

    // Generamos token
    const token = await createAccessToken({
      idpersona: nuevoUsuario.idpersona
    });

    res.json({
      idpersona,
      dni: nuevoUsuario.dni,
      correo: correo || '',
      token
    });

  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

//Peticiones POST
//Probar
export const login = async (req, res) => {
  try {
    const { dni, contrasenia } = req.body;

    if (!dni || !contrasenia) {
      return res.status(400).json({
        message: "Se necesita Usuario y Contrasenia.",
      });
    }

    const usuarioEncontrado = await Usuario.findByPk(dni);
    if (!usuarioEncontrado || !usuarioEncontrado.estado) {
      return res.stauts(401).json({
        message: "Usuario Invalido.",
      });
    }

    const coincide = await bcrypt.compare(
      contrasenia,
      usuarioEncontrado.contrasenia
    );

    if (!coincide) {
      return res.status(401).json({
        message: "Contrasenia incorrecta.",
      });
    }
    const token = await createAccessToken({
      idpersona: usuarioEncontrado.idpersona,
      nombre: usuarioEncontrado.nombre,
      apellido: usuarioEncontrado.apellido,
      dni: usuarioEncontrado.dni,
      permisos: usuarioEncontrado.permisos
    });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    
    return res.status(200).json({
      token,
      idpersona: usuarioEncontrado.idpersona,
      nombre: usuarioEncontrado.nombre,
      correo: usuarioEncontrado.correo,
      permisos: usuarioEncontrado.permisos
    });
  } catch (error) {
    console.log("Error Login: ", error);
    res.status(500).json({
      message: "Error en login",
      error: error.message,
    });
  }
};

//Peticiones POST
export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: "/",
  });

  return res.sendStatus(200);
};

//Peticiones POST
export const verify = async (req, res) => {
  //Obtenemos el token
  const token = req.cookies.token;

  console.log(token)
  //Si no hay token
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    //Verificamos el token
    const decoded = jwt.verify(token, TOKEN_SECRET);
    return res.status(200).json({ message: "Token is valid", user: decoded });
  } catch (err) {
    console.log("Error verify: ", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
