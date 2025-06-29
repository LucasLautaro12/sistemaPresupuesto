import pkg from 'pg';
import "dotenv/config";
const { Pool } = pkg;

let pool; // Variable para almacenar el pool

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Crear y obtener el pool de conexión (implementación singleton)
export const getPool = () => {
  if (!pool) {
    pool = new Pool(dbConfig);

    // Escuchar eventos importantes
    pool.on('connect', () => console.log('Nuevo cliente conectado a la base de datos.'));
    pool.on('remove', () => console.log('Cliente desconectado de la base de datos.'));
  }
  return pool;
};

// Función para conectar a la base de datos y verificar conexión inicial
export const connectDB = async () => {
  const pool = getPool(); // Asegura el uso de un solo pool
  try {
    const hora = await pool.query('SELECT NOW()'); // Consulta de prueba para verificar la conexión
    console.log('Conexión exitosa a la base de datos.', new Date(hora.rows[0].now).toLocaleTimeString());
  } catch (error) {
    console.error('Error en la conexión a la base de datos:', error);
    throw error; // Lanzar el error para que se gestione en otro lugar si es necesario 
  }
};

// Exportar el pool para su uso en otros módulos
export default getPool();

