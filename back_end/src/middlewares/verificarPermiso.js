import { getPool } from "../db.js";

export const verificarPermiso = (permisosRequeridos) => async (req, res, next) => {
  try {
    const { idpersona } = req.user;
    const pool = getPool();

    const query = `SELECT json_agg(per.nombre ORDER BY per.nombre) AS permisos
                   FROM persona p 
                   JOIN usuario u ON p.idpersona = u.idpersona
                   JOIN usuariorol ur ON u.dni = ur.dni
                   JOIN rol r ON ur.idrol = r.idrol
                   JOIN rolpermiso rp ON r.idrol = rp.idrol
                   JOIN permiso per ON rp.idpermiso = per.idpermiso
                   WHERE p.idpersona = $1
                   GROUP BY u.dni`;

    const result = await pool.query(query, [idpersona]);

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Usuario sin permisos" });
    }

    const permisosUsuario = result.rows[0].permisos || [];

    // Verifica si el usuario tiene al menos uno de los permisos requeridos
    const tienePermiso = permisosRequeridos.some(permiso => permisosUsuario.includes(permiso));

    if (!tienePermiso) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error de servidor" });
  }
};