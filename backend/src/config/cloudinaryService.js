import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import "dotenv/config";

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de multer para recibir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Asegúrate de tener la carpeta 'uploads' en tu directorio
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Asignamos un nombre único al archivo
    },
});

const upload = multer({ storage });  // Esto será utilizado en el controlador

// Función para subir imágenes a Cloudinary
export const uploadImage = async (filePath, customName) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'imagenesVexar',  // Carpeta en Cloudinary
            public_id: customName, // Nombre personalizado para el archivo
            overwrite: true // Opcional: Permite sobrescribir si ya existe un archivo con el mismo nombre
        
        });
        return result;  // Retorna el resultado que incluye la URL de la imagen subida
    } catch (error) {
        console.error("Error al subir la imagen a Cloudinary", error);
        throw error;  // Lanza el error para ser manejado en el controlador
    }
};

// Función para subir archivos PDF a Cloudinary
export const uploadFile = async (filePath, customName) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'pdfVexar',  // Carpeta en Cloudinary
            public_id: customName, // Nombre personalizado para el archivo
            overwrite: true // Opcional: Permite sobrescribir si ya existe un archivo con el mismo nombre
        });
        return result;
    } catch (error) {
        console.error("Error al subir el archivo a Cloudinary", error);
        throw error;
    }
};


