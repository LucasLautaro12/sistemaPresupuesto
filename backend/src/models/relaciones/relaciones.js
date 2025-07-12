import { Permiso } from "../permisoModel";
import { Persona } from "../personaModel";
import { Rol } from "../rolModel";
import { Usuario } from "../usuarioModel";

Permiso.belongsToMany(Rol, {
    through: 'rolpermiso',
    foreignKey: 'idpermiso',
    otherKey: 'idrol',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Rol.belongsToMany(Permiso, {
    through: 'rolpermiso',
    foreignKey: 'idrol',
    otherKey: 'idpermiso',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Usuario.belongsTo(Persona, {
    foreignKey: 'idpersona',
    onDelete: 'CASCADE'
});

Persona.hasOne(Usuario, {
    foreignKey: 'idpersona',
});

Usuario.belongsToMany(Rol, {
    through: 'usuariorol',
    foreignKey: 'dni',
    otherKey: 'idrol',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Rol.belongsToMany(PermisUsuarioo, {
    through: 'usuariorol',
    foreignKey: 'idrol',
    otherKey: 'dni',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});