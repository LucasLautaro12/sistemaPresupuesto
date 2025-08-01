import React, { useState, useEffect } from "react";
import "../styles/UsuarioTable.css";
import "./Confirmacion.css";
import EditForm from "./CreateUser/EditUser/EditForm";
import {
  fetchUsuarios,
  handleConfirmDeactivate,
  handleDeactivateUser,
} from "../../api/fetchUsuarios";
//comentario
interface Usuario {
  apellido: string;
  nombre: string;
  correo: string;
  dni: number;
  roles: string;
  estado: boolean;
}

const UsuarioTable: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserDni, setSelectedUserDni] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  useEffect(() => {
    fetchUsuarios(setUsuarios);
  }, []);
  // Mostrar formulario de confirmación

  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      normalizeText(usuario.apellido).includes(normalizeText(searchTerm)) ||
      normalizeText(usuario.nombre).includes(normalizeText(searchTerm)) ||
      usuario.dni.toString().includes(searchTerm) ||
      normalizeText(usuario.roles.join(" ")).includes(normalizeText(searchTerm))
  );
      

  //Funcion para editar el usuario
  const handleEditUser = (usuario: Usuario) => {
    setEditingUser(usuario);
  };

  return (
    <div
      className={`block-interactions ${
        showConfirmation ? "modal-active" : editingUser ? "editing-active" : ""
      }`}
    >
      {editingUser ? (
        <EditForm
          usuario={editingUser}
          onSave={(updatedUser) => {
            setUsuarios((prev) =>
              prev.map((user) =>
                user.dni === updatedUser.dni ? updatedUser : user
              )
            );
            setEditingUser(null); // Salir del modo de edición
          }}
          onCancel={() => {
            console.log("Cancelar presionado"); // Verifica que esto se muestra en la consola
            setEditingUser(null); // Salir del modo de edición
          }}
        />
      ) : (
        <div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr className="table-header">
            <th>Apellido</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>DNI</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {filteredUsuarios.map(( usuario, index) => (
            <tr key={`${usuario.dni}-${index}`}>
              <td>{usuario.apellido}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.dni}</td>
              <td>{usuario.roles.map((rol, index) => (
                <div key={index} className="rol-item">
                {rol}
              </div>
              ))}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditUser(usuario)}>✏️</button>
                <button className="delete-btn" onClick={() =>
                            handleDeactivateUser(
                              usuario.dni,
                              setSelectedUserDni,
                              setShowConfirmation
                            )}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

        </div>
      )}

      {showConfirmation && (
        <div className="confirmation-modal">
          <h3>Confirma con tu contraseña</h3>
          <h4>
            ¿Estás seguro de querer eliminar al usuario{" "}
            {
              usuarios.find((usuario) => usuario.dni === selectedUserDni)
                ?.nombre
            }{" "}
            {
              usuarios.find((usuario) => usuario.dni === selectedUserDni)
                ?.apellido
            }
            ?
          </h4>
          <input
            type="password"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button onClick={handleConfirmDeactivate}>Confirmar</button>
          <button onClick={() => setShowConfirmation(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default UsuarioTable;
