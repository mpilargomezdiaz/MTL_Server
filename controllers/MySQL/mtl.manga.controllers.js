import { addMangaStatus, getUserMangaList, removeMangaFromList } from '../../models/SequelizeModels/mtlManga.model.js'; // Importación de funciones del modelo Manga.
import { insertMangaDataIntoMySQL } from '../../models/crudsMongo/manga.functions.js'; // Importación de la función para insertar los mangas en MySQL.
import { connectToDatabase } from '../../databases/mysql.connection.js'; // Conexión a MySQL.

/**
 * Sincroniza los datos de manga e inserta la información en la base de datos MySQL.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Responde con un mensaje de éxito o de error.
 */
export async function syncAndInsertManga(req, res) {
    try {
        // Se conecta a la base de datos MySQL.
        await connectToDatabase();

        // Inserta los datos de manga en MySQL.
        await insertMangaDataIntoMySQL();

        // Responde con un mensaje de éxito.
        res.status(200).send('Data synchronized and inserted.');
    } catch (error) {
        // En caso de error, responde con un mensaje de error 500.
        res.status(500).send('Error synchronizing and inserting data.');
    }
};

/**
 * Añade o actualiza el estado de un manga en la lista de un usuario.
 * 
 * @param {Object} req - Objeto de solicitud (request) de Express, que contiene los datos del manga y su estado.
 * @param {Object} res - Objeto de respuesta (response) de Express.
 * @returns {Object} Respuesta en formato JSON con el mensaje de éxito y los datos del manga.
 */
export async function addMangas(req, res) {
    try {
        const { mangaData, status } = req.body;  // Obtiene los datos del manga y su estado desde el cuerpo de la solicitud.
        const userId = req.user.id; // Obtiene el ID del usuario desde la solicitud.

        const manga = await addMangaStatus(userId, mangaData, status);  // Añade o actualiza el estado del manga en la lista personal del usuario.

        return res.status(201).json({
            message: 'Manga added/updated successfully.',   // Responde con el mensaje de éxito y los datos del manga actualizados.
            manga
        });

    } catch (error) {
        res.status(500).json({ message: 'Error adding the manga.', error });   // En caso de error, responde con un mensaje de error 500.
    }
};

/**
 * Obtiene la lista de mangas de un usuario.
 * 
 * @param {Object} req - Objeto de solicitud (request) de Express.
 * @param {Object} res - Objeto de respuesta (response) de Express.
 * @returns {Object} Respuesta en formato JSON con la lista de mangas del usuario.
 */
export async function getMangaList(req, res) {
    try {
        const userId = req.user.id;  // Se obtiene el ID del usuario desde la solicitud.
        const mangaList = await getUserMangaList(userId);  // Se obtiene la lista de mangas del usuario.

        return res.status(200).json(mangaList);  // Responde con la lista de mangas del usuario.
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving the list.', error });  // En caso de error, responde con un mensaje de error 500.
    }
}

/**
 * Elimina un manga de la lista de un usuario.
 * 
 * @param {Object} req - Objeto de solicitud (request) de Express, que contiene el ID del manga a eliminar.
 * @param {Object} res - Objeto de respuesta (response) de Express.
 * @returns {Object} Respuesta en formato JSON con el mensaje de éxito o error.
 */
export async function removeManga(req, res) {
    try {
        const { mangaId } = req.params;  // Obtiene el ID del manga desde los parámetros de la URL.
        const userId = req.user.id;  // Obtiene el ID del usuario desde la solicitud.

        const success = await removeMangaFromList(userId, mangaId);  // Llama a la función para eliminar el manga de la lista personal del usuario.

        if (!success) {
            return res.status(404).json({ message: 'Manga not found in the list.' });  // Si el manga no se encuentra en la lista, responde con un error 404.
        }

        return res.status(200).json({ message: 'Manga removed successfully.' });  // Responde con un mensaje de éxito si el manga se eliminó correctamente.

    } catch (error) {
        res.status(500).json({ message: 'Error removing the manga.', error });  // En caso de error, responde con un mensaje de error 500.
    }
}

/**
 * Añade o elimina un manga de la lista de un usuario según el estado proporcionado.
 * Si el estado es "Drop", elimina el manga de la lista, si no, lo añade o lo actualiza.
 * 
 * @param {Object} req - Objeto de solicitud (request) de Express, que contiene los datos del manga y su estado.
 * @param {Object} res - Objeto de respuesta (response) de Express.
 * @returns {Object} Respuesta en formato JSON con el mensaje de éxito o error.
 */
export async function addManga(req, res) {
    try {
        const { mangaData, status } = req.body;  // Obtiene los datos del manga y su estado desde el cuerpo de la solicitud.
        const userId = req.user.id;  // Obtiene el ID del usuario desde la solicitud.

        if (status === "Drop") {
            const success = await removeMangaFromList(userId, mangaData._id);  // Si el estado es "Drop", elimina el manga de la lista personal del usuario.

            if (!success) {
                return res.status(404).json({ message: 'Manga not found in the list.' });  // Si el manga no se encuentra en la lista, responde con un error 404.
            }

            return res.status(200).json({ message: 'Manga removed from the list.' });  // Responde con un mensaje de éxito si el manga se eliminó correctamente.
        }

        const manga = await addMangaStatus(userId, mangaData, status);  // Si el estado no es "Drop", añade o actualiza el manga en la lista personal del usuario.

        return res.status(201).json({
            message: 'Manga added/updated successfully.',  // Responde con el mensaje de éxito y los datos del manga actualizado.
            manga
        });

    } catch (error) {
        res.status(500).json({ message: 'Error processing the request.', error });  // En caso de error, responde con un mensaje de error 500.
    }
}
