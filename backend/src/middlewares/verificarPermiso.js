//import { getPool } from "../db.js";

import { Permiso } from "../models/permisoModel.js";
import { Persona } from "../models/personaModel.js";
import { Rol } from "../models/rolModel.js";
import { Usuario } from "../models/usuarioModel.js";

export const verificarPermiso = (permisosRequeridos) => async (req, res, next) => {
  console.log("Verificando PERMISOS");

  try {
    const { idpersona } = req.user;

    // Buscar al usuario y sus permisos (encadenando asociaciones)
    const persona = await Persona.findByPk(idpersona, {
      include: {
        model: Usuario,
        include: {
          model: Rol,
          through: { attributes: [] }, // evitar campos extra de usuariorol
          include: {
            model: Permiso,
            through: { attributes: [] }, // evitar campos extra de rolpermiso
          },
        },
      },
    });

    if (!persona || !persona.usuario) {
      return res.status(403).json({ message: "Usuario no encontrado." });
    }

    const permisosUsuario = [];

    persona.usuario.rols.forEach((rol) => {
      rol.permisos.forEach((permiso) => {
        if (!permisosUsuario.includes(permiso.nombre)) {
          permisosUsuario.push(permiso.nombre);
        }
      });
    });

    const tienePermiso = permisosRequeridos.some((permiso) =>
      permisosUsuario.includes(permiso)
    );

    if (!tienePermiso) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  } catch (error) {
    console.error("Error al verificar permisos:", error);
    res.status(500).json({ message: "Error de servidor" });
  }
};
