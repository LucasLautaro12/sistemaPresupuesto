import { Abertura } from "../models/aberturaModel.js";
import { Cliente } from "../models/clientModel.js";
import { Persona } from "../models/personaModel.js";
import { Presupuesto } from "../models/presupuestoModel.js";
import { Usuario } from "../models/usuarioModel.js";
import { Tipologia } from "../models/tipologiaModel.js";
import { Linea } from "../models/lineaModel.js";
import { Archivo } from "../models/archivoModel.js";
import { UsuarioPresupuesto } from "../models/usuariopresupuesto.js";

export async function getAllPresupuestos() {
  const query = await Persona.findAll({
    attributes: ['nombre', 'apellido', 'correo'],
    include: [{
      model: Cliente,
      attributes: ['celular'],
      required: false,
      include: [{
        model: Presupuesto,
        attributes: [
          'numpresupuesto', 'fechainicio', 'urgencia', 'oktecnico',
          'monto', 'montocerrado', 'estado', 'fechaganada', 'nota', 'direccion', 'numticket'
        ],
        include: [
          {
            model: Abertura,
            attributes: [
              'idabertura', 'nombreabertura', 'ancho', 'alto', 'cantidad', 'mosquitero',
              'acoplamiento', 'detalle', 'tipovidrio'
            ],
            required: false,
            include: [
              { model: Tipologia, attributes: ['nombretipologia'], required: false, },
              { model: Linea, attributes: ['tipolinea', 'color'], required: false, }
            ]
          },
          {
            model: Archivo, // si esta es la tabla de archivos
            attributes: ['idarchivo', 'url', 'nombreoriginal'],
            required: false,
          },
          {
            model: Usuario,
            attributes: ['dni'],
            required: false,
            through: { model: UsuarioPresupuesto, attributes: ['responsable'], required: false },
            
            include: [
              { model: Persona, attributes: ['nombre', 'apellido'], required: false }
            ]
          }
        ]
      }]
    }]
  });

  return query;
}

export async function transformResult() {
  const personas = await getAllPresupuestos();
  const presupuestosMap = new Map();

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  personas.forEach(persona => {
    const cliente = persona.Cliente || {}; // asegurar que sea un objeto
    const presupuestos = cliente.Presupuestos || [];

    // Si no hay presupuestos, igual creamos un objeto "vacío" por persona
    if (presupuestos.length === 0) {
      presupuestosMap.set(`persona-${persona.dataValues.correo}`, {
        numPresupuesto: null,
        fechaInicio: "",
        cliente: `${persona.dataValues.apellido} ${persona.dataValues.nombre}`,
        correo: persona.dataValues.correo,
        ubicacion: "",
        numticket: "",
        okTecnico: "",
        monto: 0,
        montocerrado: 0,
        estado: "",
        fechaGanada: "",
        celular: cliente.celular || "",
        nota: "",
        urgencia: "",
        aberturas: [],
        archivos: [],
        responsables: [],
      });
    }

    presupuestos.forEach(presupuestoRow => {
      const numPresupuesto = presupuestoRow.numpresupuesto;

      if (!presupuestosMap.has(numPresupuesto)) {
        presupuestosMap.set(numPresupuesto, {
          numPresupuesto,
          fechaInicio: formatDate(presupuestoRow.fechainicio),
          cliente: `${persona.dataValues.apellido} ${persona.dataValues.nombre}`,
          correo: persona.dataValues.correo,
          ubicacion: presupuestoRow.direccion || "",
          numticket: presupuestoRow.numticket || "",
          okTecnico: presupuestoRow.oktecnico ? "SI" : "NO",
          monto: presupuestoRow.monto || 0,
          montocerrado: presupuestoRow.montocerrado || 0,
          estado: presupuestoRow.estado || "",
          fechaGanada: formatDate(presupuestoRow.fechaganada),
          celular: cliente.celular || "",
          nota: presupuestoRow.nota || "",
          urgencia: presupuestoRow.urgencia || "",
          aberturas: [],
          archivos: [],
          responsables: [],
        });
      }

      const presupuesto = presupuestosMap.get(numPresupuesto);

      // Aberturas
      if (presupuestoRow.Aberturas) {
        presupuestoRow.Aberturas.forEach(abertura => {
          if (!presupuesto.aberturas.some(a => a.idAbertura === abertura.idabertura)) {
            presupuesto.aberturas.push({
              idAbertura: abertura.idabertura,
              nombreAbertura: abertura.nombreabertura,
              ancho: abertura.ancho,
              alto: abertura.alto,
              cantidad: abertura.cantidad,
              mosquitero: abertura.mosquitero,
              acoplamiento: abertura.acoplamiento,
              detalle: abertura.detalle,
              tipovidrio: abertura.tipovidrio,
              nombretipologia: abertura.Tipologia?.nombretipologia || "",
              tipolinea: abertura.Linea?.tipolinea || "",
              color: abertura.Linea?.color || "",
            });
          }
        });
      }

      // Archivos
      if (presupuestoRow.Archivos) {
        presupuestoRow.Archivos.forEach(file => {
          if (!presupuesto.archivos.some(f => f.idarchivo === file.idarchivo)) {
            presupuesto.archivos.push({
              idarchivo: file.idarchivo,
              nombre: file.nombreoriginal,
              link: file.url,
            });
          }
        });
      }

      // Responsables
      if (presupuestoRow.Usuarios) {
        presupuestoRow.Usuarios.forEach(usuario => {
          const responsable = usuario.UsuarioPresupuesto;
          if (
            responsable &&
            !presupuesto.responsables.some(r => r.dni === usuario.dni)
          ) {
            presupuesto.responsables.push({
              dni: usuario.dni,
              rol: responsable.responsable || "",
              nombre: usuario.Persona ? `${usuario.Persona.apellido} ${usuario.Persona.nombre}` : "",
            });
          }
        });
      }
    });
  });

  return Array.from(presupuestosMap.values());
}

