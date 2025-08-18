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
  return Persona.findAll({
    attributes: ['nombre', 'apellido', 'correo'],
    limit: 3,
    include: [{
      model: Cliente,
      as: 'cliente',   // ✅ en minúscula
      attributes: ['celular'],
      required: false,
      include: [{
        model: Presupuesto,
        as: 'presupuesto',  // 👀 revisa también este alias
        attributes: [
          'numpresupuesto', 'fechainicio', 'urgencia', 'nota',
          'oktecnico', 'estado', 'fechaganada', 'direccion'
        ],
        required: false,
        include: [
          {
            model: Abertura,
            as: 'abertura',   // 👀 revisa igual aquí
            attributes: [
              'idabertura', 'nombreabertura', 'ancho', 'alto', 'cantidad',
              'mosquitero', 'acoplamiento', 'detalle', 'tipovidrio'
            ],
            required: false,
            include: [
              { model: Tipologia, as: 'tipologia', attributes: ['nombretipologia'], required: false },
              { model: Linea, as: 'linea', attributes: ['tipolinea', 'color'], required: false }
            ]
          },
          {
            model: Archivo,
            as: 'archivo',
            attributes: ['idarchivo', 'url', 'nombreoriginal'],
            required: false
          },
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['dni'],
            required: false,
            through: { model: UsuarioPresupuesto, attributes: ['responsable'], required: false },
            include: [
              { model: Persona, as: 'persona', attributes: ['nombre', 'apellido'], required: false }
            ]
          }
        ]
      }]
    }]
  });
}

export async function transformResult() {
  const personas = await getAllPresupuestos();
  const presupuestosMap = new Map();

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  };

  personas.forEach(persona => {
    const cliente = persona.Cliente || {};
    const presupuestos = cliente.Presupuestos || [];

    if (presupuestos.length === 0) {
      presupuestosMap.set(`persona-${persona.correo}`, {
        numPresupuesto: null,
        fechaInicio: "",
        cliente: `${persona.apellido} ${persona.nombre}`,
        correo: persona.correo,
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
          cliente: `${persona.apellido} ${persona.nombre}`,
          correo: persona.correo,
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
      if (presupuestoRow.Abertura) {
        const abertura = presupuestoRow.Abertura;
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
          color: abertura.Linea?.color || ""
        });
      }

      // Archivos
      if (presupuestoRow.Archivos) {
        presupuestoRow.Archivos.forEach(file => {
          presupuesto.archivos.push({
            idarchivo: file.idarchivo,
            nombre: file.nombreoriginal,
            link: file.url
          });
        });
      }

      // Responsables
      if (presupuestoRow.Usuarios) {
        presupuestoRow.Usuarios.forEach(usuario => {
          const responsable = usuario.UsuarioPresupuesto;
          presupuesto.responsables.push({
            dni: usuario.dni,
            rol: responsable?.responsable || "",
            nombre: usuario.Persona ? `${usuario.Persona.apellido} ${usuario.Persona.nombre}` : ""
          });
        });
      }
    });
  });

  return Array.from(presupuestosMap.values());
}
