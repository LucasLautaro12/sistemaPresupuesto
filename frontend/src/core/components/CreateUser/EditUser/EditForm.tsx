import React, { useState } from "react"; 
import "./EditForm.css";
import Input from "../../CreatePresupuesto/Input.tsx";
import { updateUser } from "../../../../api/modificarUsuario.js";
import { useNavigate } from "react-router-dom";

// 🔹 Mapeo de ID de permiso a su nombre
const permisosInfo = {
  1: "LEER_PM_USER",
  2: "CREAR_USER",
  3: "MODIFICAR_USER",
  4: "ELIMINAR_USER",
  5: "LEER_PM_PRES",
  6: "LEER_PM_TK",
  7: "CREAR_PRES",
  8: "CREAR_TK",
  9: "MODIFICAR_PM_PRES",
  10: "MODIFICAR_PM_TK",
  11: "MODIFICAR_MONTOCERRADO_PRES",
  13: "MODIFICAR_MONTO_PRES",
  16: "ADMIN"
};

// 🔹 Mapeo de Roles con sus permisos base y opcionales
const rolesPermisos = {
  VENDEDOR: { base: [5, 6, 7], opcionales: [9, 8, 11] },
  "GERENTE COMERCIAL": { base: [5, 6, 7, 8, 9, 11], opcionales: [] },
  "ATENCION CLIENTE": { base: [5, 6, 7], opcionales: [8, 9, 11] },
  "GERENTE PRODUCTO": { base: [5, 6, 7, 8, 9, 13, 11], opcionales: [] },
  "ENCARGADO PRESUPUESTO": { base: [5, 6, 7, 8, 9, 13], opcionales: [11] },
  PRESUPUESTADOR: { base: [5, 6, 13], opcionales: [7] },
  ADMIN: { base: [1, 2, 3, 4, 16], opcionales: [] }
};

const EditForm = ({ usuario, onSave, onCancel }) => {
  const navigate = useNavigate();

  // 🔹 Estados
  const [formData, setFormData] = useState({
    ...usuario,
    departamentos: usuario.departamentos || ["Ventas"]
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedOpcionalPermisos, setSelectedOpcionalPermisos] = useState<number[]>([]);

  // 🔹 Agregar un nuevo rol, con la restricción de ADMIN
  const handleAddRole = (role: string) => {
    if (!role) return;

    if (role === "ADMIN") {
      // Si elige ADMIN, borra todos los demás roles y solo deja ADMIN
      setSelectedRoles(["ADMIN"]);
    } else {
      // Si ya está ADMIN seleccionado, no permite elegir otros roles
      if (selectedRoles.includes("ADMIN")) return;

      // Agregar el rol solo si no está repetido
      if (!selectedRoles.includes(role)) {
        setSelectedRoles([...selectedRoles, role]);
      }
    }
  };

  // 🔹 Remover un rol
  const handleRemoveRole = (role: string) => {
    // Si ADMIN es el único rol, no lo deja quitar a menos que haya otro seleccionado
    if (role === "ADMIN") {
      setSelectedRoles([]); // Elimina ADMIN si se quita manualmente
    } else {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    }
  };

  // 🔹 Obtener permisos base y opcionales según roles seleccionados
  const getPermisosDisponibles = () => {
    let basePermisos = new Set<number>();
    let opcionales = new Set<number>();

    selectedRoles.forEach((role) => {
      rolesPermisos[role]?.base.forEach((p) => basePermisos.add(p));
    });

    selectedRoles.forEach((role) => {
      rolesPermisos[role]?.opcionales.forEach((p) => {
        if (!basePermisos.has(p)) opcionales.add(p); // Si ya está en base, no agregarlo a opcionales
      });
    });

    return { basePermisos: Array.from(basePermisos), opcionales: Array.from(opcionales) };
  };

  const { basePermisos, opcionales } = getPermisosDisponibles();

  // 🔹 Guardar cambios y mostrar JSON en consola
  const handleSave = async () => {
    // 1) Construimos un objeto con cada rol y sus permisos correspondientes.
    //    Tomamos los permisos base y añadimos los opcionales que hayan sido marcados.
    const rolesObject = {};
    selectedRoles.forEach((role) => {
      const base = rolesPermisos[role]?.base || [];
      const opcionalesRol = rolesPermisos[role]?.opcionales || [];
      const permisosRol = new Set<number>(base);

      // Agregamos los permisos opcionales que el usuario haya marcado
      opcionalesRol.forEach((perm) => {
        if (selectedOpcionalPermisos.includes(perm)) {
          permisosRol.add(perm);
        }
      });

      rolesObject[role] = Array.from(permisosRol);
    });

    // 2) Armamos el JSON final con la estructura solicitada:
    //    {
    //      nombre,
    //      apellido,
    //      correo,
    //      departamento,
    //      roles: {
    //         "ROL1": [1,2,3],
    //         "ROL2": [5,6,7]
    //      }
    //    }
    //
    // 🔹 Mantenemos el resto de la info como está, solo cambiamos la forma
    //    en la que representamos los roles y sus permisos.
    const jsonFinal = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      departamento: formData.departamentos[0],

      // Guardamos los roles con su lista de permisos dentro
      roles: rolesObject
    };

    console.log("JSON Final:", JSON.stringify(jsonFinal, null, 2));

    await updateUser(formData.dni, jsonFinal);
    onSave(jsonFinal);
    navigate("/usuario");
    window.location.reload(); // Recarga la página completamente
  };

  return (
    <div className="edit-form-container">
      <div className="edit-form">
        {/* 🔹 Primera parte: Dos columnas */}
        <Input label="Nombre" value={formData.nombre} onChange={(value) => setFormData({ ...formData, nombre: value })} />
        <Input label="Apellido" value={formData.apellido} onChange={(value) => setFormData({ ...formData, apellido: value })} />
        <Input label="Correo" type="email" value={formData.correo} onChange={(value) => setFormData({ ...formData, correo: value })} />
        <Input label="DNI" value={formData.dni.toString()} onChange={() => {}} type="number" disabled={true} />

        {/* 🔹 Segunda parte: Una sola columna */}
        <div className="departments-wrapper">
          <label>Departamentos</label>
          <select onChange={(e) => setFormData({ ...formData, departamentos: [e.target.value] })} value={formData.departamentos[0]}>
            <option value="">Seleccionar un departamento</option>
            <option value="COMERCIAL">COMERCIAL</option>
            <option value="PRODUCTO">PRODUCTO</option>
            <option value="COMPRAS/SUPPLY CHAIN">COMPRAS/SUPPLY CHAIN</option>
            <option value="PRODUCCION">PRODUCCION</option>
            <option value="ADMINISTRACION">ADMINISTRACION</option>
            <option value="ALMACEN">COMPRAS/SUPPLY CHAIN</option>
            <option value="INSTALACION">PRODUCCION</option>
            <option value="SISTEMAS">ADMINISTRACION</option>
          </select>
        </div>

        <div className="departments-wrapper">
          <label>Roles</label>
          <select onChange={(e) => handleAddRole(e.target.value)} value="">
            <option value="">Seleccionar un rol</option>
            {Object.keys(rolesPermisos).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <div className="selected-departments">
            {selectedRoles.map((role) => (
              <div key={role} className="selected-department">
                {role}
                <span className="remove-department" onClick={() => handleRemoveRole(role)}>❌</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 Sección Informativa: Permisos Básicos Minimalistas */}
        {basePermisos.length > 0 && (
          <div className="departments-wrapper">
            <label>Permisos Básicos</label>
            <ul className="readonly-permissions">
              {basePermisos.map((permiso) => (
                <li key={permiso}>{permisosInfo[permiso]}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 🔹 Permisos Opcionales con el checkbox a la izquierda */}
        {opcionales.length > 0 && (
          <div className="departments-wrapper">
            <label>Permisos Opcionales</label>
            <div className="permisos-opcionales">
              {opcionales.map((permiso) => (
                <div key={permiso}>
                  <input 
                    type="checkbox" 
                    checked={selectedOpcionalPermisos.includes(permiso)} 
                    onChange={() => setSelectedOpcionalPermisos((prev) =>
                      prev.includes(permiso) ? prev.filter((p) => p !== permiso) : [...prev, permiso]
                    )}
                  />
                  <span>{permisosInfo[permiso] || `Permiso ${permiso}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-buttons">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
