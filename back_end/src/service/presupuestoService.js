import { getPool } from "../db.js";

export async function getAllPresupuestos() {
  const pool = getPool();
  const query = `
                SELECT 
                    pers.nombre, pers.apellido, pers.correo, c.celular, 
                    pres.numpresupuesto, pres.fechainicio, pres.urgencia, 
                    pres.oktecnico, pres.monto, pres.montocerrado, pres.estado, 
                    pres.fechaganada, pres.nota, pres.direccion, pres.numticket,
                    a.idabertura, a.nombreabertura, a.ancho, a.alto, a.cantidad, 
                    a.mosquitero, a.acoplamiento, a.detalle, a.tipovidrio, 
                    l.tipolinea, l.color, t.nombretipologia, 
                    ar.idarchivo, ar.url, ar.nombreoriginal, 
                    up.dni AS responsable_dni, up.responsable AS responsable_tipo,
                    p_res.nombre AS responsable_nombre, p_res.apellido AS responsable_apellido
                FROM persona pers 
                JOIN cliente c ON pers.idpersona = c.idpersona
                JOIN clientepresupuesto cp ON cp.celular = c.celular
                JOIN presupuesto pres ON pres.numpresupuesto = cp.numpresupuesto
                LEFT JOIN abertura a ON a.numpresupuesto = pres.numpresupuesto
                LEFT JOIN tipologia t ON t.idtipologia = a.idtipologia
                LEFT JOIN linea l ON l.idlinea = a.idlinea
                LEFT JOIN archivopresupuesto ap ON ap.numpresupuesto = pres.numpresupuesto 
                LEFT JOIN archivo ar ON ar.idarchivo = ap.idarchivo 
                LEFT JOIN usuario u ON u.idpersona = pers.idpersona
                LEFT JOIN usuariopresupuesto up ON up.numpresupuesto = pres.numpresupuesto 
                LEFT JOIN usuario u_res ON up.dni = u_res.dni  
                LEFT JOIN persona p_res ON u_res.idpersona = p_res.idpersona  
                ORDER BY pres.numpresupuesto DESC;`;

  const { rows } = await pool.query(query);
  return rows;
}

export async function transformResult() {
  const result = await getAllPresupuestos();
  const presupuestosMap = new Map();

  result.forEach((row) => {
    const numPresupuesto = row.numpresupuesto;

    // Función para formatear la fecha
    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      return `${day}-${month}-${year}`;
    };

    if (!presupuestosMap.has(numPresupuesto)) {
      presupuestosMap.set(numPresupuesto, {
        numPresupuesto,
        fechaInicio: formatDate(row.fechainicio),
        cliente: `${row.apellido} ${row.nombre}`,
        correo: row.correo,
        ubicacion: row.direccion,
        numticket: row.numticket,
        okTecnico: row.oktecnico ? "SI" : "NO",
        monto: row.monto,
        montocerrado: row.montocerrado,
        estado: row.estado,
        fechaGanada: formatDate(row.fechaganada),
        celular: row.celular,
        nota: row.nota,
        urgencia: row.urgencia,
        aberturas: [],
        archivo: [],
        responsables: [],
      });
    }

    const presupuesto = presupuestosMap.get(numPresupuesto);

    // Añadir abertura si no está repetida
    if (!presupuesto.aberturas.some((a) => a.idAbertura === row.idabertura)) {
      presupuesto.aberturas.push({
        idAbertura: row.idabertura,
        nombretipologia: row.nombretipologia,
        nombreAbertura: row.nombreabertura,
        ancho: row.ancho,
        alto: row.alto,
        cantidad: row.cantidad,
        tipolinea: row.tipolinea,
        tipovidrio: row.tipovidrio,
        color: row.color,
        nombrevidrio: row.nombrevidrio,
        mosquitero: row.mosquitero,
        accionamiento: row.accionamiento,
        acoplamiento: row.acoplamiento,
        detalle: row.detalle,
      });
    }

    // Añadir archivo si no está repetido
    if (row.url && !presupuesto.archivo.some((file) => file.link === row.url)) {
      presupuesto.archivo.push({
        idarchivo: row.idarchivo,
        nombre: row.nombreoriginal,
        link: row.url,
      });
    }

    // Añadir responsable si no está repetido
    if (
      row.responsable_dni &&
      !presupuesto.responsables.some(
        (r) => r.dni === row.responsable_dni && r.rol === row.responsable_tipo
      )
    ) {
      presupuesto.responsables.push({
        dni: row.responsable_dni,
        rol: row.responsable_tipo, // Puede ser "CREADOR", "PRESUPUESTADOR" o "FINALIZADOR"
        nombre: `${row.responsable_apellido} ${row.responsable_nombre}`,
      });
    }
  });

  return Array.from(presupuestosMap.values());
}
