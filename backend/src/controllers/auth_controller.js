import Usuario, {
  getDni,
  saveUsuario,
  getUsuarioByDNI,
} from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
/* import { TOKEN_SECRET } from "../config.js"; */
import { createAccessToken } from "../libs/jwt.js";

import "dotenv/config";
import { getRolByName } from "../models/rolModel.js";
import { getDepartamentoByName } from "../models/departamentModel.js";
import { getMaxId } from "../models/presupuestoModel.js";

const TOKEN_SECRET = process.env.TOKEN_SECRET;

//Peticiones POST
export const register = async (req, res) => {
  try {
    const { user, roles, department, permissions } = req.body;
    
    const { apellido, nombre, dni, correo, contrasenia1, estado } = user;

    const maxIdPersona = await getMaxId("idpersona","persona");
    const idpersona = maxIdPersona + 1;

    const usuarioExistente = await getDni(parseInt(dni));
    if (usuarioExistente) {
      return res.status(400).json({ message: "El DNI ya está registrado." });
    }

    const contraseniaHash = await bcrypt.hash(contrasenia1, 10);

    const usuario = new Usuario(
      idpersona,
      apellido,
      nombre,
      correo ? correo : '',
      dni,
      contraseniaHash,
      estado,
      department
    );
    
    const idrol = await getRolByName(roles);

    const usuarioGuardado = await saveUsuario(
      usuario,
      idrol,
      permissions
    );

    const token = await createAccessToken({
      idpersona: usuarioGuardado.idpersona,
    });

    res.json({
      idpersona: usuarioGuardado.idpersona,
      dni: usuarioGuardado.dni,
      correo: usuarioGuardado.correo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error: ", error);
  }
};

//Peticiones POST
export const login = async (req, res) => {
  try {
    const { dni, contrasenia } = req.body;

    if (!dni || !contrasenia) {
      return res.status(400).json({
        message: "Se necesita Usuario y Contrasenia.",
      });
    }

    const usuarioEncontrado = await getUsuarioByDNI(dni);
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
  const token = req.body.token || req.headers.authorization?.split(" ")[1];
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
