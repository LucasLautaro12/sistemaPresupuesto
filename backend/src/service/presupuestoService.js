import { Persona } from "../models/personaModel.js";
import { Cliente } from "../models/clientModel.js";
import { Presupuesto } from "../models/presupuestoModel.js";
import { Abertura } from "../models/aberturaModel.js";
import { Tipologia } from "../models/tipologiaModel.js";
import { Linea } from "../models/lineaModel.js";
import { Archivo } from "../models/archivoModel.js";
import { Usuario } from "../models/usuarioModel.js";
import { UsuarioPresupuesto } from "../models/usuariopresupuesto.js";

export async function getAllPresupuestos() {
  return await Presupuesto.findAll({
    attributes: ["numpresupuesto", "fechainicio", "urgencia", "nota", "monto", "montocerrado",
      "oktecnico", "estado", "fechaganada", "direccion", "urgencia"],
    include: [
      {
        model: Cliente,
        as: 'cliente',
        attributes: ['celular'],
        through: { attributes: [] },
        //where: { celular: '38880101010' }, // 👈 filtro en cliente
        include: [
          {
            model: Persona,
            as: 'persona',
            attributes: ['nombre', 'apellido', 'correo']
          }
        ]
      },
      {
        model: Abertura,
        as: 'abertura',
        attributes: ['idabertura', 'nombreabertura', 'ancho', 'alto', 'cantidad',
          'mosquitero', 'acoplamiento', 'detalle', 'tipovidrio'],
        include: [
          {
            model: Tipologia,
            as: 'tipologia',
            attributes: ['nombretipologia'],
          },
          {
            model: Linea,
            as: 'linea',
            attributes: ['tipolinea', 'color'],
          }
        ]
      },
      {
        model: Archivo,
        as: 'archivo',
        attributes: ['idarchivo', 'url', 'nombreoriginal'],
      },
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['dni'],
        through: { model: UsuarioPresupuesto, attributes: ['responsable'], required: false },
        include: [
          { model: Persona, as: 'persona', attributes: ['nombre', 'apellido'], required: false }
        ]
      }
    ],
    order: [["numpresupuesto", "DESC"]]
  });
}

export async function transformResult() {
  const presupuestosRows = await getAllPresupuestos();
  const presupuestosMap = new Map();

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  presupuestosRows.forEach(p => {
    const numPresupuesto = p.numpresupuesto;

    if (!presupuestosMap.has(numPresupuesto)) {
      // Tomamos el primer cliente del array si existe
      const cliente = Array.isArray(p.cliente) && p.cliente.length > 0 ? p.cliente[0] : null;
      const persona = cliente && cliente.persona ? cliente.persona : null;

      presupuestosMap.set(numPresupuesto, {
        numPresupuesto,
        fechaInicio: formatDate(p.fechainicio),
        cliente: persona ? `${persona.apellido} ${persona.nombre}` : "",
        correo: persona ? persona.correo : "",
        ubicacion: p.direccion || "",
        numticket: p.numticket || "",
        okTecnico: p.oktecnico ? "SI" : "NO",
        monto: p.monto || 0,
        montocerrado: p.montocerrado || 0,
        estado: p.estado || "",
        fechaGanada: formatDate(p.fechaganada),
        celular: cliente ? cliente.celular : "",
        nota: p.nota || "",
        urgencia: p.urgencia,
        aberturas: [],
        archivos: [],
        responsables: [],
      });
    }

    const presupuesto = presupuestosMap.get(numPresupuesto);

    // Aberturas (puede ser objeto o array)
    const aberturas = Array.isArray(p.abertura) ? p.abertura : [p.abertura].filter(Boolean);
    aberturas.forEach(a => {
      presupuesto.aberturas.push({
        idAbertura: a.idabertura,
        nombreAbertura: a.nombreabertura,
        ancho: a.ancho || 0,
        alto: a.alto || 0,
        cantidad: a.cantidad || 0,
        mosquitero: !!a.mosquitero,
        acoplamiento: !!a.acoplamiento,
        detalle: a.detalle || "",
        tipovidrio: a.tipovidrio || "",
        nombretipologia: a.tipologia ? a.tipologia.nombretipologia : "",
        tipolinea: a.linea ? a.linea.tipolinea : "",
        color: a.linea ? a.linea.color : ""
      });
    });

    // Archivos
    if (Array.isArray(p.archivo)) {
      p.archivo.forEach(file => {
        presupuesto.archivos.push({
          idarchivo: file.idarchivo,
          nombre: file.nombreoriginal || "",
          link: file.url || ""
        });
      });
    }

    // Usuarios responsables
    if (Array.isArray(p.usuario)) {
      p.usuario.forEach(u => {
        const responsable = u.usuariopresupuesto || u.UsuarioPresupuesto; // según cómo venga
        const persona = u.persona || null;
        presupuesto.responsables.push({
          dni: u.dni || "",
          rol: responsable ? responsable.responsable : "",
          nombre: persona ? `${persona.apellido} ${persona.nombre}` : ""
        });
      });
    }
  });

  return Array.from(presupuestosMap.values());
}

