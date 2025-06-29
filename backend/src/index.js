// index.js
import { server } from "./app.js";
import { connectDB } from "./db.js";
import "dotenv/config";

const main = async () => {
  // Conectar a la base de datos
  await connectDB();

  // Iniciar el servidor
  const BACK_PORT = process.env.BACK_PORT || 5000;
  server.listen(BACK_PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${BACK_PORT}`);
  });

};

main(); 
