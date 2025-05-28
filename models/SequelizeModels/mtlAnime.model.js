import { DataTypes } from 'sequelize'; // Se importa DataTypes desde Sequelize para definir los tipos de datos en el modelo.
import { MySQLConnection } from '../../databases/mysql.js'; // Se importa la función para establecer la conexión con MySQL

const sequelize = MySQLConnection(); // Conexión con la base de datos de MySQL.

/**
 * Definición del modelo 'MTLAnime' que se usará para interactuar con la tabla 'mtlanime' en MySQL.
 * Este modelo representa la lista de animes personalizada de un usuario, incluyendo información
 * sobre el anime y su estado (visto, en progreso, pendiente...)
 */
const MTLAnime = sequelize.define('MTLAnime', {
    id: {
        type: DataTypes.INTEGER, // Tipo de dato INTEGER para el id.
        primaryKey: true, // Marca este campo como clave primaria.
        autoIncrement: true // Este campo se incrementará automáticamente.
    },
    userId: {
        type: DataTypes.INTEGER, // Tipo de dato INTEGER para 'userId'.
        allowNull: false, // No puede estar vacío.
        references: {
            model: "User", // El campo hace referencia al modelo 'User'.
            key: "id", // Referencia al campo 'id' en el modelo 'User'.
        }
    },
    animeId: {
        type: DataTypes.STRING, // Tipo de dato STRING para 'animeId'.
        allowNull: false, // No puede estar vacío.
        references: {
            model: "Anime", // El campo hace referencia al modelo 'Anime'.
            key: 'animeId', // Referencia al campo 'animeId' en el modelo 'Anime'.
        },
    },
    title: {
        type: DataTypes.STRING, // Tipo de dato STRING para 'title'.
        allowNull: false, // No puede estar vacío.
    },
    synopsis: {
        type: DataTypes.TEXT, // Tipo de dato TEXT para 'synopsis'.
        allowNull: false // No puede estar vacío.
    },
    image: {
        type: DataTypes.STRING, // Tipo de dato STRING para 'image'.
        allowNull: false // No puede estar vacío.
    },
    genres: {
        type: DataTypes.STRING, // Tipo de dato STRING para 'genres'.
        allowNull: false // No puede estar vacío.
    },
    status: {
        type: DataTypes.STRING, // Tipo de dato STRING para 'status'.
        allowNull: false, // No puede estar vacío.
    },
}, {
    tableName: 'mtlanime', // El nombre de la tabla en la base de datos será 'mtlanime'.
    timestamps: false // No se agregarán campos de tiempo como 'createdAt' o 'updatedAt'.
});

export default MTLAnime; // Se exporta del modelo 'MTLAnime' para usarlo en otras partes de la aplicación.

/* --------- CRUD -----------*/

/**
 * Función para agregar o actualizar el estado de un anime en la lista del usuario.
 * Si el anime ya está en la lista, solo se actualiza el estado.
 * Si no está en la lista, se agrega como nuevo anime con el estado proporcionado.
 * 
 * @param {number} userId - El ID del usuario al que pertenece la lista de animes.
 * @param {Object} animeData - Los datos del anime (ID, título, sinopsis, imagen, géneros).
 * @param {string} status - El estado del anime.
 * @returns {Promise} - Devuelve el anime con su estado actualizado o agregado.
 * @throws {Error} - Si ocurre un error al agregar o actualizar el anime en la base de datos.
 */
export async function addAnimeStatus(userId, animeData, status) {
    try {
        // Se busca o se crea un nuevo registro en la tabla 'mtlanime' con el userId y animeId proporcionados.
        const [anime, created] = await MTLAnime.findOrCreate({
            where: { userId, animeId: animeData._id },
            defaults: {
                userId, // Establece el userId.
                animeId: animeData._id, // Establece el animeId.
                title: animeData.title, // Establece el título del anime.
                synopsis: animeData.synopsis, // Establece la sinopsis del anime.
                image: animeData.image, // Establece la imagen del anime.
                genres: animeData.genres.join(', '), // Establece los géneros como una cadena separada por comas.
                status // Establece el estado del anime.
            }
        });

        // Si el registro ya existía, sólo se actualiza el estado.
        if (!created) {
            anime.status = status; // Se actualiza el estado del anime.
            await anime.save(); // Se guardan los cambios.
        }
        return anime; // Se devuelve el anime con su estado actualizado.
    } catch (error) {
        console.error("Error adding anime to the list:", error); // Manejo de errores.
        throw error;
    }
};

/**
 * Función para obtener la lista de animes de un usuario específico.
 * 
 * @param {number} userId - El ID del usuario para obtener su lista de animes.
 * @returns {Promise} - Devuelve la información de los animes de la lista personal del usuario.
 * @throws {Error} - Si ocurre un error al obtener la lista de animes desde la base de datos.
 */
export async function getUserAnimeList(userId) {
    try {
        return await MTLAnime.findAll({ where: { userId } });  // Se obtienen todos los animes asociados con el userId.
    } catch (error) {
        console.error("Error retrieving the anime list:", error); // Manejo de errores.
        throw error;
    }
};

/**
 * Función para eliminar un anime de la lista de un usuario.
 * 
 * @param {number} userId - El ID del usuario que desea eliminar el anime de su lista.
 * @param {string} animeId - El ID del anime a eliminar.
 * @returns {Promise<boolean>} - Devuelve true si el anime fue eliminado, o false si no se encontró.
 * @throws {Error} - Si ocurre un error al eliminar el anime desde la base de datos.
 */
export async function removeAnimeFromList(userId, animeId) {
    try {
        // Se elimina el anime especificado de la lista del usuario.
        const deleted = await MTLAnime.destroy({
            where: { userId, animeId } // Condición para encontrar el anime específico del usuario.
        });

        // Devuelce true si el anime fue eliminado, o false si no se encontró.
        return deleted > 0;
    } catch (error) {
        console.error("Error removing anime from the list:", error); // Manejo de errores.
        throw error;
    }
};
