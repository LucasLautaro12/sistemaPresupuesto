// db.js
import { Sequelize } from "sequelize";
import "dotenv/config";

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
  ssl: {
    rejectUnauthorized: false,
  },
};

// Crear una instancia de Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Para que no falle por certificados autofirmados
      },
    },
  }
);
const hora = new Date().toLocaleString();
// Función para conectar a la base de datos y verificar conexión inicial
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Conexión exitosa a ${dbConfig.database}: ${hora}.`);
  } catch (error) {
    console.error("Error en la conexión a la base de datos:", error);
    throw error; // Lanzar el error para que se gestione en otro lugar si es necesario
  }
};

// Exportar la instancia de Sequelize para su uso en otros módulos
export default sequelize;