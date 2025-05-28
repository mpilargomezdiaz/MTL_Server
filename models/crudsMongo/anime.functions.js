import Anime from '../SequelizeModels/anime.model.js'; // Se importa el modelo Anime de Sequelize.
import mongo from '../../databases/mongo.connection.js'; // Se importa la conexión con MongoDB.
import dotenv from 'dotenv'; // Se importa dotenv para cargar las variables de entorno del archivo .env

dotenv.config(); // Se cargan las variables de entorno.

const client = await mongo.connectToMongo(); // Conexión a la base de datos de MongoDB.

/**
 * Función que obtiene los datos de anime desde MongoDB.
 *
 * @returns {Array} - Array con los datos de los animes.
 * @throws {Error} - Si ocurre un error al leer los datos de MongoDB.
 */
async function getAnimeDataFromMongoDB() {
    const db = client.db(process.env.MONGO_BBDD); // Conexión a la base de datos.
    const collection = db.collection(process.env.COLL_1); // Obtención de la colección.

    try {
        const result = await collection.find({}).toArray(); // Se obtiene la información.
        const animeData = result.map(anime => ({
            ...anime,
            _id: anime._id.toString() // Se convierte el _id de MongoDB a string.
        }));
        return animeData;
    } catch (error) {
        console.error('Error reading data from MongoDB: ', error); // Si se produce algún error, se muestra un mensaje en la consola.
        throw error;
    }
}

/**
 * Función para insertar o actualizar los datos de anime en MySQL.
 *
 * @returns {void} - Un mensaje que indica la finalización de la operación de inserción o actualización.
 * @throws {Error} - Si ocurre un error al insertar o actualizar los datos en MySQL.
 */
async function insertAnimeDataIntoMySQL() {
    try {
        const animeDataArray = await getAnimeDataFromMongoDB(); // Se obtienen los datos de anime de MongoDB.

        // Se itera sobre los datos de anime y se insertan o actualizan en MySQL
        for (const animeData of animeDataArray) {
            await Anime.upsert({ // Si el registro no existe, se inserta; sino, se actualiza.
                animeId: animeData._id, // El id del anime.
            });
        }
        console.log('Anime data inserted or updated in MySQL.'); // Si no se produce ningún error. Se muestra un mensaje de éxito en la consola.
    } catch (error) {
        console.error('Error inserting or updating anime data:', error); // Si se produce un error, se muestra un mensaje de error en la consola.
    }
}

export { getAnimeDataFromMongoDB, insertAnimeDataIntoMySQL }; // Se exportan las funciones para poder usarlas en otras partes de la aplicación.
