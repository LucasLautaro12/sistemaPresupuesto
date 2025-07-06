import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import { Persona } from "./personaModel.js";

export const Usuario = sequelize.define('usuario', {
  dni: { type: DataTypes.INTEGER, primaryKey: true },
  contrasenia: DataTypes.STRING,
  estado: DataTypes.BOOLEAN,
  departamento: DataTypes.STRING,
  primer_ingreso: DataTypes.BOOLEAN,
  idpersona: DataTypes.INTEGER,
}, {
  tableName: 'usuario',
  timestamps: false,
})

Usuario.belongsTo(Persona, { foreignKey: 'idpersona', onDelete: 'CASCADE' });
Persona.hasOne(Usuario, { foreignKey: 'idpersona', })



// Actualizar usuarioRol
const actualizarUsuarioRol = async (dni, roles) => {
  console.log(roles)
  const pool = getPool();

  try {
    if (roles.length === 0) {
      return { message: "No se enviaron roles para actualizar" };
    }

    const valores = [];
    const placeholders = roles.map((_, index) => `($1, $${index + 2})`).join(", ");

    const queryInsert = `
          INSERT INTO usuariorol (dni, idrol)
          VALUES ${placeholders}
          ON CONFLICT (dni, idrol) DO NOTHING;
      `;

    valores.push(dni, ...roles);

    await pool.query(queryInsert, valores);

    return { message: "Roles actualizados correctamente" };
  } catch (error) {
    console.error("Error al actualizar los roles del usuario:", error);
    throw error;
  }
};

// Actualizar rolPermiso
const actualizarRolPermiso = async (rol, permisos) => {
  if (rol.length !== permisos.length) {
    throw new Error("Las listas 'rol' y 'permisos' deben tener la misma longitud.");
  }

  const query = `
      INSERT INTO rolpermiso (idRol, idPermiso) VALUES ($1, $2)
      ON CONFLICT (idRol, idPermiso) DO NOTHING;
  `;

  try {
    const client = await pool.connect();
    for (let i = 0; i < rol.length; i++) {
      const idRol = rol[i];
      const permisosLista = permisos[i];

      for (const idPermiso of permisosLista) {
        await client.query(query, [idRol, idPermiso]);
      }
    }
    client.release();
    console.log("Permisos actualizados correctamente.");
  } catch (error) {
    console.error("Error al actualizar permisos:", error);
  }
};

// Obtener datos de Usuario
export const getUsuarioByDNI = async (dni) => {
  // Verificación de que el DNI es válido (por ejemplo, es un número y no está vacío)
  const pool = getPool();
  const query = `
        SELECT u.dni, u.contrasenia, p.idPersona, p.apellido, p.nombre, p.correo, u.estado,
               array_agg(DISTINCT per.nombre) AS permisos
        FROM usuario u  
        JOIN persona p ON u.idPersona = p.idPersona
        JOIN usuariorol ur ON ur.dni = u.dni
        JOIN rol r ON r.idrol = ur.idrol
        JOIN rolpermiso rp ON rp.idrol = r.idrol
        JOIN permiso per ON rp.idpermiso = per.idpermiso
        WHERE u.dni = $1
        GROUP BY u.dni, u.contrasenia, p.idPersona, p.apellido, p.nombre, p.correo; `;

  try {
    // Realizar la consulta a la base de datos
    const result = await pool.query(query, [dni]);

    // Si no se encuentran resultados, se lanza un error más específico
    if (result.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const row = result.rows[0];
    // Crear y devolver el objeto Usuario con los datos obtenidos
    return new Usuario(
      row.idpersona,
      row.apellido ? row.apellido.trim() : "", // Asegura que no haya espacios extras
      row.nombre ? row.nombre.trim() : "", // Asegura que no haya espacios extras
      row.correo || "", // Asegura que el correo sea vacío si es nulo
      row.dni,
      row.contrasenia ? row.contrasenia.trim() : "", // Asegura que no haya espacios extras en la contraseña
      row.estado,
      row.roles ? row.roles : "",
      row.permisos ? row.permisos : ''
    );
  } catch (error) {
    console.log("Error en la consulta de usuario: ", error);
    throw error; // Lanzar el error para que pueda ser manejado por quien llama la función
  }
};

// Obtener DNI SI SE USA
export const getDni = async (dni) => {
  try {
    const pool = getPool();
    const query = `
            SELECT * FROM usuario WHERE dni = $1
        `;
    const result = await pool.query(query, [dni]);
    return result.rows[0];
  } catch (error) {
    console.log("Error en getDNI: ", error);
    throw error;
  }
};

// Obtener Usuarios
export const getTodosUsuarios = async () => {
  const pool = getPool();
  const query = `
        SELECT 
              u.dni, u.contrasenia, u.departamento, u.estado, p.idPersona,  p.apellido, 
              p.nombre, p.correo, array_agg(DISTINCT r.nombrerol) AS roles,
              array_agg(DISTINCT per.nombre) AS permisos
        FROM usuario u
        JOIN persona p ON u.idPersona = p.idPersona
        JOIN usuariorol ur ON ur.dni = u.dni
        JOIN rol r ON r.idrol = ur.idrol
        JOIN rolpermiso rp ON rp.idrol = r.idrol
        JOIN permiso per ON rp.idpermiso = per.idpermiso
        WHERE u.estado = true
        GROUP BY u.dni, u.contrasenia, u.departamento, p.idPersona, p.apellido, p.nombre, p.correo
        ORDER BY p.idpersona;`;
  try {
    // Realizar la consulta a la base de datos
    const result = await pool.query(query);

    // Si no se encuentran resultados, retornar un arreglo vacío
    if (result.rows.length === 0) {
      return []; // No hay usuarios en la base de datos
    }
    // Mapear los resultados a instancias de Usuario
    return result.rows.map(
      (row) =>
        new Usuario(
          row.idpersona,
          row.apellido ? row.apellido.trim() : "", // Asegura que no haya espacios extras
          row.nombre ? row.nombre.trim() : "", // Asegura que no haya espacios extras
          row.correo || "", // Asegura que el correo sea vacío si es nulo
          row.dni,
          row.contrasenia ? row.contrasenia.trim() : "",
          row.estado ? row.estado : "",
          row.roles ? row.roles : "",
          row.permisos ? row.permisos : "",
        )
    );
  } catch (error) {
    console.log("Error en la consulta de todos los usuarios: ", error);
    throw error; // Lanzar el error para que pueda ser manejado por quien llama la función
  }
};

// Guardar Usuarios
export const saveUsuario = async (nuevoUsuario, idrol, idpermissions) => {
  const pool = getPool();

  // Validaciones de entrada
  if (!nuevoUsuario || !idrol || !idpermissions) {
    throw new Error("Datos de entrada incompletos o inválidos.");
  }
  if (!Array.isArray(idrol) || idrol.length === 0) {
    throw new Error("El parámetro 'idrol' debe ser un array con al menos un elemento.");
  }
  if (!Array.isArray(idpermissions)) {
    throw new Error("El parámetro 'idpermissions' debe ser un array.");
  }

  const queryPersona = `INSERT INTO persona (idPersona, apellido, nombre, correo) VALUES ($1, $2, $3, $4) RETURNING idPersona;`;
  const queryUsuario = `INSERT INTO usuario (dni, contrasenia, estado, departamento, idPersona) VALUES ($1, $2, $3, $4, $5) RETURNING dni;`;
  const queryUsuarioRol = `INSERT INTO usuariorol (dni, idrol) VALUES ($1, $2);`;
  const queryRolPermiso = `INSERT INTO rolpermiso (idrol, idpermiso) VALUES ($1, $2);`;

  try {
    // Inicia la transacción
    await pool.query("BEGIN");

    // Insertar en persona
    console.log("Insertando en persona:", nuevoUsuario);
    const personaResult = await pool.query(queryPersona, [
      nuevoUsuario.idpersona,
      nuevoUsuario.apellido,
      nuevoUsuario.nombre,
      nuevoUsuario.correo,
    ]);
    if (personaResult.rowCount === 0) throw new Error("Error al insertar en persona.");

    const idPersona = personaResult.rows[0].idpersona;
    console.log("ID Persona insertado:", idPersona);

    // Insertar en usuario
    console.log("Insertando en usuario:", nuevoUsuario);
    const usuarioResult = await pool.query(queryUsuario, [
      parseInt(nuevoUsuario.dni),
      nuevoUsuario.contrasenia,
      nuevoUsuario.estado,
      nuevoUsuario.departamento,
      idPersona,
    ]);
    if (usuarioResult.rowCount === 0) throw new Error("Error al insertar en usuario.");

    const dniUsuario = usuarioResult.rows[0].dni;
    console.log("DNI Usuario insertado:", dniUsuario);

    // Insertar en usuariorol
    const idRol = idrol[0]; // Tomamos el primer rol
    console.log("Insertando en usuariorol:", dniUsuario, idRol);
    const usuarioRolResult = await pool.query(queryUsuarioRol, [dniUsuario, idRol]);
    if (usuarioRolResult.rowCount === 0) throw new Error("Error al insertar en usuariorol.");

    // Insertar permisos en rolpermiso si existen
    if (idpermissions.length > 0) {
      console.log("Insertando permisos:", idpermissions);

      // Verificar que idRol y idpermissions sean válidos
      if (!idRol || typeof idRol !== "number") {
        throw new Error("El parámetro 'idRol' debe ser un número válido.");
      }
      if (idpermissions.some((idPermiso) => typeof idPermiso !== "number")) {
        throw new Error("El parámetro 'idpermissions' debe contener solo números.");
      }

      // Insertar permisos individualmente
      for (const idPermiso of idpermissions) {
        console.log(`Insertando permiso: idRol=${idRol}, idPermiso=${idPermiso}`);
        const rolPermisoResult = await pool.query(queryRolPermiso, [idRol, idPermiso]);
        if (rolPermisoResult.rowCount === 0) throw new Error(`Error al insertar permiso ${idPermiso}.`);
      }
    }

    // Confirmar la transacción
    await pool.query("COMMIT");
    console.log("Transacción completada correctamente.");

    return usuarioResult.rows[0];
  } catch (error) {
    // Si hay error, hacer rollback
    await pool.query("ROLLBACK");
    console.error("Error en la transacción:", error.message);
    throw error;
  }
};

// Obtener constrasenia con idpersona
export const getContraseniaById = async (idpersona) => {
  const pool = getPool();
  const query = `
    select u.contrasenia 
    from usuario u 
    join persona p 
    on p.idpersona = u.idpersona
    where u.idpersona = $1;
    `;
  try {
    const result = await pool.query(query, [idpersona]);
    return result.rows[0].contrasenia;
  } catch (error) {
    console.log("Error al obtener la contrasenia: ", error.message);
    throw error;
  }
};

// Función reutilizable para actualizar cualquier tabla
export const actualizarRegistro = async (tabla, idCampo, idValor, updates) => {
  if (!Object.keys(updates).length)
    return { success: false, message: "No hay cambios para actualizar" };

  const pool = getPool();
  const campos = Object.keys(updates)
    .map((key, i) => `${key} = $${i + 1}`)
    .join(", ");
  const valores = Object.values(updates).concat(idValor);
  const query = `UPDATE ${tabla} SET ${campos} WHERE ${idCampo} = $${valores.length} RETURNING *`;
  const { rowCount, rows } = await pool.query(query, valores);
  return rowCount
    ? { success: true, message: `${tabla} actualizado`, data: rows[0] }
    : { success: false, message: `${tabla} no encontrado` };
};

// Modificar usuarios
export const updateUsuario = async (
  dni, nombre, apellido, correo, departamento, rolesArray, permisosMap
) => {
  const pool = getPool();
  const query = `
        SELECT idpersona 
        FROM usuario 
        WHERE dni = $1;`;
  try {
    await pool.query("BEGIN"); // Iniciar transacción

    // Obtener el idPersona asociado al usuario
    const usuarioRes = await pool.query(query, [dni]);
    if (usuarioRes.rowCount === 0) {
      await pool.query("ROLLBACK");
      return { success: false, message: "Usuario no encontrado" };
    }

    const idPersona = usuarioRes.rows[0].idpersona;

    // Actualizar `persona`
    const personaUpdates = {};
    if (nombre) personaUpdates.nombre = nombre;
    if (apellido) personaUpdates.apellido = apellido;
    if (correo !== undefined && correo !== null) {
      personaUpdates.correo = correo.trim() === '' ? '' : correo;
    }

    const usuarioUpdates = {};
    if (departamento) usuarioUpdates.departamento = departamento;

    let response = {
      success: false,
      message: "No se realizó ninguna actualización",
    };

    if (Object.keys(personaUpdates).length > 0) {
      response = await actualizarRegistro(
        "persona",
        "idpersona",
        idPersona,
        personaUpdates
      );
    }

    if (Object.keys(usuarioUpdates).length > 0) {
      response = await actualizarRegistro(
        "usuario",
        "dni",
        dni,
        usuarioUpdates
      );
    }
    console.log('Roles: ', rolesArray)
    if (rolesArray.length > 0) {
      await actualizarUsuarioRol(dni, rolesArray);
    }
    console.log('Permisos: ', permisosMap)
    if (rolesArray.length > 0 && permisosMap.length > 0) {
      await actualizarRolPermiso(rolesArray, permisosMap);
    }

    await pool.query("COMMIT"); // Confirmar transacción
    return response;
  } catch (error) {
    await pool.query("ROLLBACK"); // Revertir cambios en caso de error
    console.error("Error al actualizar usuario:", error);
    return { success: false, message: "Error interno del servidor" };
  }
};

// Cambiar de activo a inactivo
export const changeState = async (dni, stateUser) => {
  const pool = getPool();
  const query = `
    UPDATE usuario
    SET estado = $2
    WHERE dni = $1;
    `;
  try {
    await pool.query(query, [dni, stateUser]);
    return { succes: true, message: "Usuario desactivado." };
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al actualizar el usuario.", error });
  }
};

// Obtener correos por dni
export const getCorreoByDni = async (dni) => {
  const pool = getPool();
  const query = `
    SELECT p.correo
    FROM usuario u
    JOIN persona p ON u.idpersona = p.idpersona
    WHERE dni = $1;`;

  try {
    const result = await pool.query(query, [dni]);
    return result.rows[0].correo;
  } catch (error) { }
};
