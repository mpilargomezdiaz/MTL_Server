import Manga from '../SequelizeModels/manga.model.js'; // Se importa el modelo Manga de Sequelize.
import mongo from '../../databases/mongo.connection.js'; // Se importa la conexión con MongoDB.
import dotenv from 'dotenv'; // Se importa dotenv para cargar las variables de entorno del archivo .env
dotenv.config(); // Se cargan las variables de entorno.

// Conexión a MongoDB utilizando la función definida en mongo.connection.js
const client = await mongo.connectToMongo(); // Conexión a la base de datos de MongoDB.

/**
 * Función que obtiene los datos de manga desde MongoDB.
 *
 * @returns {Array} - Array con los datos de los mangas.
 * @throws {Error} - Si ocurre un error al leer los datos de MongoDB.
 */
async function getMangaDataFromMongoDB() {
    const db = client.db(process.env.MONGO_BBDD); // Conexión a la base de datos.
    const collection = db.collection(process.env.COLL_2); // Obtención de la colección.

    try {
        const result = await collection.find({}).toArray(); // Se obtiene la información.
        const mangaData = result.map(manga => ({
            ...manga,
            _id: manga._id.toString() // Se convierte el _id de MongoDB a string.
        }));
        return mangaData;
    } catch (error) {
        console.error('Error reading data from MongoDB:', error); // Si se produce algún error, se muestra un mensaje en la consola.
        throw error;
    }
}

/**
 * Función para insertar o actualizar los datos de manga en MySQL.
 *
 * @returns {void} - Un mensaje que indica la finalización de la operación de inserción o actualización.
 * @throws {Error} - Si ocurre un error al insertar o actualizar los datos en MySQL.
 */
async function insertMangaDataIntoMySQL() {
    try {
        const mangaDataArray = await getMangaDataFromMongoDB(); // Se obtienen los datos de manga de MongoDB.

        // Se itera sobre los datos de manga y se insertan o actualizan en MySQL
        for (const mangaData of mangaDataArray) {
            await Manga.upsert({ // Si el registro no existe, se inserta; sino, se actualiza.
                mangaId: mangaData._id, // El id del manga.
            });
        }
        console.log('Manga data inserted or updated in MySQL.'); // Si no se produce ningún error. Se muestra un mensaje de éxito en la consola.
    } catch (error) {
        console.error('Error inserting or updating manga data:', error); // Si se produce un error, se muestra un mensaje de error en la consola.
    }
}

export { getMangaDataFromMongoDB, insertMangaDataIntoMySQL }; // Se exportan las funciones para poder usarlas en otras partes de la aplicación.
