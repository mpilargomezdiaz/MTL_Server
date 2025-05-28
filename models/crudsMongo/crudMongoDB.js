import mongo from '../../databases/mongo.connection.js'; // Para la conexión con MongoDB.
import dotenv from 'dotenv';
dotenv.config();
const client = await mongo.connectToMongo(); // Se establece la conexión.

export default {

    /**
     * Función para obtener todos los documentos de una colección en MongoDB.
     * 
     * @param {string} collectionName - El nombre de la colección de MongoDB desde la cual se van a obtener los documentos.
     * @returns {Array} - Devuelve un array con los documentos.
     * @throws {Error} - Lanza un error si ocurre algún problema al acceder o al leer los datos de la base de datos.
     */
    getAll: async (collectionName) => {
        let result = {}; // Se declara un array vacío para almacenar el resultado.
        try {
            const db = client.db(process.env.MONGO_BBDD); // Se accede a la base de datos utilizando la URL configurada en las variables de entorno.
            const collection = db.collection(collectionName); // Se accede a la colección que se pasa como parámetro a la función.
            result = await collection.find({}).toArray(); // Se obtienen todos los documentos de la colección y se convierten en un array.
        } finally {

            await mongo.closeClient() // Se cierra la conexión.
        }

        return result; // Se devuelve el resultado (todos los documentos de la colección).
    }
}
