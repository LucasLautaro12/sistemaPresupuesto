import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const FRONT_PORT = process.env.FRONT_PORT || "http://localhost:5173";

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: FRONT_PORT,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Importar y usar rutas de la API
import authRoutes from './routes/auth_routes.js';
import presRoutes from './routes/pres_routes.js';
import userRoutes from './routes/user_routes.js';
import tkRoutes from './routes/tk_routes.js';
import emailRouter from './routes/email_routes.js';

app.use(authRoutes);
app.use(presRoutes);
app.use(userRoutes);
app.use(tkRoutes);
app.use(emailRouter);

// Si querés exportar el servidor:
const server = app; // No estás usando HTTP Server directamente
export { server };

//export default app;
