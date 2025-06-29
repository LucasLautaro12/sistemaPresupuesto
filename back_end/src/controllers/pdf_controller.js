import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { response } from "express";

// Definir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const email = "ventas@vexar.com.ar";
const today = new Date();
const day = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0
const year = today.getFullYear();
const fecha = `${day}/${month}/${year}`;
const numPres = 1234;
const telefono = 4224421;
const clietne = "Alguien";
const responsable = "JUAN MANUEL GALIAN";

const encabezado = (doc, imagePath) => {
    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, 50, 50, { width: 100 });
    }
  
    // Información de la empresa alineada a la derecha
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("VEXAR S.R.L.", 300, 50, { align: "right" })
      .font("Helvetica-Bold")
      .text("ALUMINIO PVC Y VIDRIO", { align: "right" })
      .font("Helvetica")
      .text(`SAN SALVADOR DE JUJUY - ${telefono}`, { align: "right" })
      .text(`Email: ${email}`, { align: "right" })
      .text(`Fecha: ${fecha}`, { align: "right" });
  
    doc
      .font("Helvetica-Oblique")
      .text(`Presupuesto Nro: ${numPres}`, 50, 120, { align: "left" });
  };
  
  // Función para verificar si el contenido cabe en la página sin excederla y agregar nueva página si es necesario
  const checkPageFull = (doc, contentHeight, imagePath) => {
    const pageHeight =
      doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
    if (doc.y + contentHeight > pageHeight) {
      doc.addPage(); // Agregar una nueva página si el contenido excede
      encabezado(doc, imagePath); // Repetir el encabezado en la nueva página
    }
  };
  
  export const previewpdf = (req, res) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
  
    // Cambiar el Content-Disposition a "attachment" para descargar el archivo
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="presupuesto.pdf"');
    doc.pipe(res);
  
    // Definir la ruta de la imagen
    const imagePath = path.join(__dirname, "./img/LogoSinFondo 1.png");
  
    // Página 1 (Encabezado inicial)
    encabezado(doc, imagePath);
    doc
      .moveDown()
      .font("Helvetica")
      .moveDown()
      .text(`Sres:    ${clietne}`)
      .text(`Dir:     ${clietne}`)
      .text(`Ref:     ${clietne}`)
      .text(`Atención:    ${clietne}`, { align: "right" });
  
    doc.font("Helvetica").moveDown().text(`Hola, ¡bienvenidos a Vexar!`);
  
    doc
      .fontSize(11)
      .font("Helvetica")
      .moveDown()
      .moveDown()
      .text(
        `Tenemos el placer de presentarle nuestra cotización detallada, que ha sido elaborada de acuerdo con sus especificaciones y requerimientos. En este documento, encontrará una descripción de los productos seleccionados, incluyendo medidas precisas, precios unitarios, plazos estimados de disponibilidad de materiales y diversas opciones de pago disponibles.`,
        { align: "justify" }
      );
  
    // Verificar si el contenido cabe en la página antes de agregar más contenido
    checkPageFull(doc, 50, imagePath); // 50 es el espacio estimado para el contenido actual
  
    doc
      .moveDown()
      .moveDown()
      .text(
        `Le recomendamos dedicar el tiempo necesario para examinar minuciosamente esta información, ya que nuestra prioridad es asegurar su plena satisfacción. En caso de surgir alguna pregunta o consulta, no dude en ponerse en contacto con nuestros asesores, quienes estarán encantados de brindarle la asistencia necesaria.`,
        { align: "justify" }
      );
  
    checkPageFull(doc, 50, imagePath);
  
    doc
      .moveDown()
      .moveDown()
      .text(
        `Agradecemos profundamente su interés en nuestros productos y servicios, y esperamos tener la oportunidad de atender sus necesidades de la manera más eficiente y satisfactoria posible. Valoramos en gran medida la confianza depositada en nuestra empresa.`,
        { align: "justify" }
      );
  
    checkPageFull(doc, 50, imagePath);
  
    doc
      .moveDown()
      .moveDown()
      .text(`Le enviamos nuestros más cordiales saludos.`, { align: "justify" });
  
    doc
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .moveDown()
      .font("Helvetica-Bold")
      .text(`${responsable}`, { align: "justify" })
      .font("Helvetica-Bold")
      .text("INGENIERIA COMERCIAL Y PRODUCTO")
      .font("Helvetica-Bold")
      .text("VEXAR S.R.L.");
  
    checkPageFull(doc, 50, imagePath);

    doc
      .moveDown()
      .font("Helvetica-Bold")
      .text(`BASES Y CONDICIONES VEXAR:
      1-Condiciones de venta:
      Validez de oferta: 2 días o variación del dólar oficial a la venta Banco de la Nación Argentina.
      Forma de pago: A definir.
      Para la instalación de los productos presupuestados, se deberá haber registrado el pago del 100% de la cotización. Incluyendo los adicionales y extras, producto de diferencias entre lo cotizado y lo relevado en obra.`, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`2-Plazos de entrega:
      A continuación, se enuncian de manera descriptiva los plazos que conlleva el proceso de producción de aberturas a medida, recuerde tenerlos en cuenta ya que las aberturas son hechas milimétricamente de acuerdo a la obra, no son aberturas de medidas estandarizadas. Las aberturas pasan por un proceso de producción de muchos detalles para cumplir con los estándares de calidad y normas de seguridad vigentes.`, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`2.1-Provisión de materiales:
      El proceso de compra de materiales e insumos tarda un mínimo de 45 y 60 días desde que se confirma el presupuesto, medidas y colores de aberturas. En caso que surjan cambios posteriores de confirmado el presupuesto y nuestros proveedores tengan disponibilidad de materiales, los plazos vuelven a ser los mismos entre 45 y 60 días.`, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`2.2-Medición y programación de entrega:
      La fecha estimada de medición, es para que podamos activar la etapa de fabricación e instalación, la misma lleva como mínimo entre 30 y 45 días desde que confirmamos la medición en obra, sin cambios al presupuesto inicial ni adicionales. En caso de ser una obra en etapas, se respetan los mismos plazos desde la medición para la fabricación.`, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`Es importante consensuar con su Asesor Comercial la fecha estimada de medición y la fecha estimada de entrega de obra en el momento de la compra, para VEXAR es clave realizar una buena planificación de obra.
      Si por parte del cliente no hubiera una fecha clara de entrega, este deberá mantener al tanto a su Asesor Comercial del avance de la obra y definir una fecha precisa con la mayor antelación posible. 
      De esta forma, se volverá a consensuar una fecha de entrega de nuestros productos.
      El plazo de entrega puede variar y estará sujeta a una reprogramación teniendo en cuenta la mejor disponibilidad de producción en caso de:
      1- La obra no esté en condiciones correctas de medición a la fecha programada.  
      2- Se modifican las medidas de aberturas. 
      3- Se modifican formas de aperturas o cualquier detalle técnico distinto al definido en el presente presupuesto, ya que esto puede implicar tener que adquirir nuevos  materiales.
      Sugerimos avisar con un mínimo de 90 días de antelación.`, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`2.2.1-Condiciones necesarias para la toma de medidas / condiciones técnicas: 
      a- Presupuesto no contempla ningún trabajo de demolición ni albañilería.
      b- Los vanos de las aberturas deberán estar necesariamente terminados (con revoque fino o emplacados y enmasillados).
      c- La obra deberá tener contrapiso y carpeta terminada. 
      d- En caso de realizar vanos de placas cementicias, los vanos deberán tener refuerzos interiores (no se puede atornillar a placa).
      e- En caso de colocar marcos embutidos en piso, deberá estar terminada la carpeta para el correcto asiento de la abertura. Sugerimos no colocar la fila de pisos que emparden con el umbral de la abertura para dejar margen de cualquier ajuste de plomo o encuadre de la abertura. 
      f- Barandas: Las barandas deben instalarse sobre superficies macizas de resistencia como Hormigón Armado o perfiles de hierro debidamente dimensionados. De darse cualquier otra situación, será necesario que el cliente refuerce dicha estructura. Para el asesoramiento sobre ello, ponemos a disposición nuestro equipo técnico.
      g- Perforaciones sobre cerámicos, porcelanatos, mosaicos, etc. Al perforar una pieza de estos materiales, puede ocurrir una rajadura o rotura de la misma, esto suele pasar por cuestiones constructivas ajenas a Vexar (por ejemplo, por la incorrecta distribución del pegamento de la misma o por la propia vibración que genera la operación). De llegar a producirse la rotura, el cliente deberá reemplazar dicha pieza.
      h- Por cualquier consulta técnica, consulte nuestro departamento de Obras. 
      i-En obras que sean para recambio de aberturas, la empresa acordara previa visita con los técnicos y plazos establecidos en las siguientes condiciones, el día en que se realizara el trabajo, para poder instalar las nuevas aberturas, necesitamos que los vanos estén terminados con revoque fino y correctamente fraguado.`, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`2.3-Fabricación:
      Una vez realizada la medición de los vanos, confirmados por el cliente, o responsable de obra, se inicia el proceso de fabricación de aberturas, este proceso lleva como mínimo entre 30 y 45 días.`, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`En el caso de fabricación y provisión de vidrios templados, la producción no depende directamente de la empresa, la fecha de entrega será confirmada por nuestro proveedor, una vez confirmada la medición final por Vexar (firma en formulario de medición). Los plazos mínimos son 60 días desde la fecha de medición. Una vez que llegan a la planta de la empresa, se debe revisar la calidad de los mismos, para poder ser instalados, en caso de algún desperfecto se informa al cliente y se pide de nuevo, volviendo los plazos al inicio del proceso de vidrios templados. Los vidrios templados, son fabricados a medidas, no pueden ser cortados, pulidos o modificados posteriormente, por riesgo de estallido por el proceso de templado.`, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`Las aberturas que ofrecemos se fabrican utilizando herrajes y accesorios disponibles en colores negro, marrón o plateado, sujeto a la disponibilidad de nuestros proveedores al momento de la fabricación. Es importante destacar que una vez instaladas las aberturas, no se aceptan solicitudes de cambio de color en los herrajes y accesorios.`, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`2.4-Instalación:
      El momento de instalación ideal de las aberturas, es cuando la obra está en el mismo momento de ser pintada, podemos instalar cuando el cliente lo indique, pero si las condiciones de obra no son las adecuadas, se dejará firmado el formulario de entrega de obra donde inicia la garantía, que no serán cubiertas dichas aberturas. `, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`En la instalación debe haber un responsable de obra, arquitecto o dueño, al finalizar la misma se debe firmar la conformidad en el formulario de cierre de obra y recepcionar las llaves en caso de ser aberturas con cerraduras.`, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`2.5-Oblak:
      Las puertas Oblak son productos fabricados por una industria de alta calidad en medidas estándar, sin posibilidad de modificación, recorte ni adaptación. Es crucial que los vanos sean precisos y cumplan con las especificaciones técnicas de cada producto. Las medidas y los tipos de apertura deben ser determinados en el momento de la venta, para lo cual Vexar ofrece asesoramiento técnico y comercial, minimizando el riesgo de errores. Se recomienda consultar los catálogos técnicos con un profesional de la construcción.`, { align: "justify" })
      .moveDown()
      .font("Helvetica-Bold")
      .text(`Vexar se encarga de suministrar e instalar las puertas de manera eficiente, limpia y rápida, sobre vanos ya terminados y pisos colocados. Los trabajos adicionales de acabado, como enmasillado, lijado y pintado en la unión del marco con la mampostería, son responsabilidad del cliente. Es importante señalar que Vexar no realiza trabajos de albañilería.`, { align: "justify" }).moveDown()
      .font("Helvetica-Bold")
      .text(`3-Garantía de nuestros productos:
      Nuestras aberturas poseen una garantía por seis meses una vez instaladas, por fallas de fabricación en perfiles y herrajes.
      Los vidrios una vez instalados y controlados por el cliente, no tienen garantía de roturas posteriores.
      No cubre roturas ni fallas por el mal uso.`, { align: "justify" }).moveDown()
      .font("Helvetica-Bold")
      .text(`La garantía inicia cuando se firma el formulario de entrega de obra. 
      En caso que el cliente solicite la instalación en obras que no están en el estado que aconseja Vexar, la garantía no cubre las fallas y roturas que surjan por el uso en obra.`, { align: "justify" }).moveDown()
      .font("Helvetica-Bold")
      .text(`La empresa se reserva el derecho de dar garantías por trabajos en obras sin revoques grueso, fino, techos, falta de contrapisos y carpetas.
      En relación con los vidrios DVH (doble vidriado hermético), estos cuentan con una garantía de cinco años para cubrir defectos tales como fallas o pinchaduras en las cámaras. Transcurrido este período, cualquier necesidad de reemplazo de los vidrios será sujeta a una nueva cotización. 
      Nuestras aberturas no ofrecen garantía contra daños derivados de robos, dado que no son aberturas blindadas ni diseñadas específicamente como anti robos.`, { align: "justify" }).moveDown()
      .font("Helvetica-Bold")
      .text(`Nota 1: Las Normas Técnicas IRAM y las Legislaciones vigentes en Argentina determinan las zonas factibles de impacto humano, donde deben usarse VIDRIOS DE SEGURIDAD (LAMINADOS O TEMPLADOS). A fin de evitar accidentes y roturas indeseadas de vidrios.
      Nota 2: Los esquemas de las aberturas son sólo representativos. Algunos accesorios pueden variar en función de las Líneas cotizadas. Consulte por cualquier duda.
      Nota 3: Los vidrios de color, especiales, stop sol y alta performance pueden romper por STRESS TERMICO si son montados sin tratamiento. Por lo tanto, recomendamos enfáticamente utilizar los mismos TEMPLADOS. De esta forma además se transforma en un vidrio de seguridad y alta resistencia. Consulte por favor. 
      VEXAR ES FABRICANTE OFICIAL DE TECNOPERFILES®PERFILES DE PVC.
      VEXAR UTILIZA EXCLUSIVAMENTE ACCESORIOS DE ALTA CALIDAD QUE GARANTIZAN EL EXCELENTE FUNCIONAMIENTO DE SUS PRODUCTOS A LARGO PLAZO.
      LOS VIDRIOS VEXAR SON PRODUCIDOS POR PROVEEDORES QUE POSEEN LAS ÚLTIMAS TECNOLOGÍAS EN PRODUCCIÓN DE VIDRIOS PROCESADOS. MÁXIMA CALIDAD GARANTIZADA. `, { align: "justify" });
    // No se agregan más páginas innecesarias
    doc.end();
  };
  
  
