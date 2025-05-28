import mongo from '../../databases/mongo.connection.js'; // Importación de la conexión con MongoDB.
import dotenv from 'dotenv'; // Importación para cargar variables de entorno desde el archivo .env
import multer from 'multer'; // Middleware para manejar la subida de las imágenes.
import path from "path"; // Importación para las rutas de los archivos.
import { fileURLToPath } from "url"; // Importación para convertir URLs a rutas de archivos en el sistema.
import genericMongoCrud from '../../models/crudsMongo/crudMongoDB.js';
// Se cargan las variables de entorno desde el archivo .env
dotenv.config();

// Conexión a MongoDB.
const client = await mongo.connectToMongo();

// Se obtiene la ruta del archivo actual.
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename); 

// Configuración de multer para la subida de imágenes.
const storage = multer.diskStorage({
	/**
	 * Función que define la carpeta donde se guardarán las imágenes de anime subidas.
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} file - La imagen que se va a subir.
	 * @param {Function} cb - Callback que se llama con la ruta de destino del archivo.
	 */
	destination: (req, file, cb) => {
		cb(null, path.join('./public/uploads/animes')); // Se guardan las imágenes en la ruta './public/uploads/animes'.
	},

	/**
	 * Función que define el nombre de la imagen de anime subida.
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

// Exportación de funciones para las rutas de anime.
export default {

	/**
	 * Función para obtener todos los animes desde MongoDB.
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} - Devuelve un JSON de todos los animes.
	 */
	allAnimes: async (req, res) => {
		try {
			const result = await genericMongoCrud.getAll(process.env.COLL_1)
			res.json(result)
		} catch (error) {
			res.status(500).send('Internal Server Error');
		}
		finally {
			await mongo.closeClient()
		}
	},

	postImageAnime: upload.single("image"), // Middleware para manejar la subida de una sola imagen.
	
	/**
	 * Función para la respuesta de la subida de una imagen.
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {void} - Responde con el mensaje de éxito o de error.
	 */
	postImageARes: (req, res) => {
		try {
			// Si no se produce ningún error, se envía una respuesta exitosa con la ruta de la imagen subida.
			res.status(200).json({
				message: "Image uploaded successfully.",
				filePath: `/uploads/animes/${req.file.filename}`
			});
		} catch (error) {
			// En caso de error, se responde con un error 500.
			console.error("Error uploading the image:", error);
			res.status(500).json({ message: "Error uploading the image.", error: error.message });
		}
	},

	/**
	 * Función para agregar un nuevo anime a la base de datos de MongoDB.
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {void} - Responde con el mensaje de éxito o de error.
	 */
	postNewAnime: async (req, res) => {
		try {
			const newAnime = req.body; 	// Se obtienen los datos del anime desde el cuerpo de la solicitud.
			const db = client.db(process.env.MONGO_BBDD); // Conexión a la base de datos.
			const collection = db.collection(process.env.COLL_1); // Obtención de la colección.
			await collection.insertOne(newAnime); // Se inserta el nuevo anime en la colección.
			res.status(201).json({ message: "Anime added successfully." }); // Si no se produce ningún error, se envía una respuesta exitosa.
		} catch (error) {
			console.error("Error saving the anime: ", error); // En caso de error, se responde con un error 500.
			res.status(500).json({ message: "Error saving the anime.", error: error.message });
		}
	}
}
