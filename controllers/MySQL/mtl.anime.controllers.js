import { addAnimeStatus, getUserAnimeList, removeAnimeFromList } from '../../models/SequelizeModels/mtlAnime.model.js'; // Importación de funciones del modelo Anime.
import { insertAnimeDataIntoMySQL } from '../../models/crudsMongo/anime.functions.js'; // Importación de la función para insertar los animes en MySQL.
import { connectToDatabase } from '../../databases/mysql.connection.js'; // Conexión a MySQL.

/**
 * Función que sincroniza los datos de anime y los inserta en la base de datos MySQL.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {void} - Responde con un mensaje de éxito o de error.
 */
export async function syncAndInsert (req, res) {
    try {
        // Se conecta a la base de datos MySQL.
        await connectToDatabase();

        // Inserta los datos de anime en MySQL.
        await insertAnimeDataIntoMySQL();

        // Responde con un mensaje de éxito.
        res.status(200).send('Data synchronized and inserted.');
    } catch (error) {
        // En caso de error, devuelve un mensaje de error 500.
        res.status(500).send('Error synchronizing and inserting the animes.');
    }
};

/**
 * Función que añade o actualiza el estado de un anime en la lista de un usuario.
 * @param {Object} req - El objeto de solicitud de Express, que contiene los datos del anime y del estado.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {void} - Responde con el mensaje de éxito y los datos del anime actualizados o con un mensaje de error.
 */
export async function addAnimes(req, res) {
    try {
        const { animeData, status } = req.body; // Obtiene los datos del anime y los de su estado desde el cuerpo de la solicitud.
        const userId = req.user.id; // Obtiene el ID del usuario desde la solicitud.

        const anime = await addAnimeStatus(userId, animeData, status);  // Añade o actualiza el estado del anime en la lista personal del usuario.

        return res.status(201).json({
            message: 'Anime successfully added/updated.',   // Responde con el mensaje de éxito y los datos del anime actualizados.
            anime
        });

    } catch (error) {
        res.status(500).json({ message: 'Error adding anime.', error });   // En caso de error, devuelve un mensaje de error 500.
    }
};

/**
 * Función que obtiene la lista de animes de un usuario.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {void} - Responde con la lista de animes del usuario o con un mensaje de error.
 */
export async function getAnimeList(req, res) {
    try {
        const userId = req.user.id; // Se obtiene el ID del usuario desde la solicitud.
        const animeList = await getUserAnimeList(userId); // Se obtiene la lista de animes del usuario.
        return res.status(200).json(animeList); // Responde con la lista de animes del usuario.
    } catch (error) {
        res.status(500).json({ message: 'Error fetching the list.', error }); // En caso de error, devuelve un mensaje de error 500.
    }
}

/**
 * Función que elimina un anime de la lista de un usuario.
 * @param {Object} req - El objeto de solicitud de Express, que contiene el ID del anime a eliminar.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {void} - Responde con un mensaje de éxito o de error al usuario.
 */
export async function removeAnime(req, res) {
    try {
        const { animeId } = req.params; // Obtiene el ID del anime desde los parámetros de la URL.
        const userId = req.user.id; // Obtiene el ID del usuario desde la solicitud.
        const success = await removeAnimeFromList(userId, animeId); // Llama a la función para eliminar el anime de la lista personal del usuario.

        if (!success) {
            return res.status(404).json({ message: 'Anime not found in the list.' }); // Si el anime no se encuentra en la lista, responde con un error 404.
        }
        return res.status(200).json({ message: 'Anime successfully deleted.' });  // Responde con un mensaje de éxito si el anime se eliminó correctamente.

    } catch (error) {
        res.status(500).json({ message: 'Error deleting anime.', error }); // En caso de error, devuelve un mensaje de error 500.
    }
}

/**
 * Función que añade o elimina un anime de la lista de un usuario en función del estado.
 * Si el estado es "Drop", elimina el anime de la lista, si no, lo añade o lo actualiza.
 * @param {Object} req - El objeto de solicitud de Express, que contiene los datos del anime y del estado.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {void} - Responde con un mensaje de éxito o de error al usuario.
 */
export async function addAnime(req, res) {
    try {
        const { animeData, status } = req.body; // Obtiene los datos del anime y su estado.
        const userId = req.user.id; // Obtiene el ID del usuario desde la solicitud.

        if (status === "Drop") {
            const success = await removeAnimeFromList(userId, animeData._id); // Si el estado es "Drop", elimina el anime de la lista personal del usuario.

            if (!success) {
                return res.status(404).json({ message: 'Anime not found in the list.' }); // Si el anime no se encuentra en la lista, responde con un error 404.
            }
            return res.status(200).json({ message: 'Anime removed from the list.' }); // Responde con un mensaje de éxito si el anime se eliminó correctamente.
        }
        const anime = await addAnimeStatus(userId, animeData, status); // Si el estado no es "Drop", añade o actualiza el anime en la lista personal del usuario.

        return res.status(201).json({
            message: 'Anime added/updated successfully.',  // Responde con el mensaje de éxito y los datos del anime actualizado.
            anime
        });

    } catch (error) {
        res.status(500).json({ message: 'Error processing the request.', error }); // En caso de error, devuelve un mensaje de error 500.
    }
}
