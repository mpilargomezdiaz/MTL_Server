import mongo from '../../databases/mongo.connection.js' // Conexión con MongoDB
import dotenv from 'dotenv'; // Para las variables de entorno.
dotenv.config(); // Carga las variables de entorno desde el archivo .env
import multer from 'multer'; // Middleware para manejar la subida de las imágenes.
import path from 'path';  // Importación para las rutas de los archivos.
import { fileURLToPath } from 'url'; // Importación para convertir URLs a rutas de archivos en el sistema.
import genericMongoCrud from '../../models/crudsMongo/crudMongoDB.js';
const client = await mongo.connectToMongo() // Conexión a la base de datos MongoDB.

// Se obtiene la ruta del archivo actual.
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Configuración de multer para la subida de imágenes.
const storage = multer.diskStorage({
    /**
	 * Función que define la carpeta donde se guardarán las imágenes de manga subidas.
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} file - La imagen que se va a subir.
	 * @param {Function} cb - Callback que se llama con la ruta de destino del archivo.
	 */
    destination: (req, file, cb) => {
        cb(null, path.join('./public/uploads/mangas'));  // Se guardan las imágenes en la ruta './public/uploads/mangas'.
    },
    
    /**
	 * Función que define el nombre de la imagen de manga subida.
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} file - La imagen que se va a subir.
	 * @param {Function} cb - Callback que se llama con el nombre de la imagen.
	 */
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

// Inicialización del middleware de multer.
const upload = multer({ storage: storage });

// Exportación de funciones para las rutas de manga.

export default {

    /**
	 * Función para obtener todos los mangas desde MongoDB.
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} - Devuelve un JSON de todos los mangas.
	 */
    allMangas: async (req, res) => {
        try {
            const result = await genericMongoCrud.getAll(process.env.COLL_2)
            res.json(result)
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
        finally {
            await mongo.closeClient()
        }
    },

    postImageManga: upload.single("image"), // Middleware para manejar la subida de una sola imagen.

    /**
	 * Función para la respuesta de la subida de una imagen.
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {void} - Responde con el mensaje de éxito o de error.
	 */
    postImageMRes: (req, res) => {
        try {
            // Si no se produce ningún error, se envía una respuesta exitosa con la ruta de la imagen subida.
            res.status(200).json({
                message: "Image uploaded successfully.",
                filePath: `/uploads/mangas/${req.file.filename}`
            });
        } catch (error) {
            // En caso de error, se responde con un error 500.
            console.error("Error uploading the image.: ", error);
            res.status(500).json({ message: "Error uploading the image", error: error.message });
        }
    },

    /**
	 * Función para agregar un nuevo manga a la base de datos de MongoDB.
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {void} - Responde con el mensaje de éxito o de error.
	 */
    postNewManga: async (req, res) => {
        try {
           
            const newManga = req.body; // Se obtienen los datos del manga desde el cuerpo de la solicitud.
            const db = client.db(process.env.MONGO_BBDD); // Conexión a la base de datos.
            const collection = db.collection(process.env.COLL_2); // Obtención de la colección.
            await collection.insertOne(newManga); // Se inserta el nuevo manga en la colección.
            res.status(201).json({ message: "Manga added successfully" }); // Si no se produce ningún error, se envía una respuesta exitosa.
        } catch (error) {
            console.error("Error saving the manga: ", error); // En caso de error, se responde con un error 500.
            res.status(500).json({ message: "Error saving the manga", error: error.message });
        }
    }
}
