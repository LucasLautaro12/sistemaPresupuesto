import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta del archivo de credenciales
const credentialsPath = path.join(__dirname, "../config/bot-vexar-prueba-f033b7f2db43.json");

// Autenticación con Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export const agregarFilaGoogleSheet = async (data) => {
  try {
    const spreadsheetId = "1-UeD63H3OBZSTODBuDYzcU39j7SvZewKjbva7E9KWUY"; // Reemplaza con tu ID de Google Sheets
    const range = "A:Z"; // Define el rango donde se insertarán los datos

    const values = [
      [
        data.numticket,
        data.numpresupuesto,
        data.fem,
        data.obra,
        data.zona,
        data.direccion,
        data.linea,
        data.total_cantidad,
        data.observaciones,
        data.responsable,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: { values },
    });

    console.log("Datos agregados a Google Sheets correctamente.");
  } catch (error) {
    console.error("Error al agregar datos a Google Sheets:", error);
  }
};
