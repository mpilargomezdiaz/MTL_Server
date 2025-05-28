// Se importa DataTypes desde Sequelize para definir los tipos de datos en el modelo.
import { DataTypes, Sequelize } from 'sequelize';

// Se importa la función para establecer la conexión con MySQL
import { MySQLConnection } from '../../databases/mysql.js';

// Conexión con la base de datos de MySQL.
const sequelize = MySQLConnection();

/**
 * Definición del modelo 'MTLManga' que se usará para interactuar con la tabla 'mtlmanga' en MySQL.
 * Este modelo representa la lista de mangas personalizada de un usuario, incluyendo información
 * sobre el manga y su estado (leído, en progreso, pendiente...)
 */
const MTLManga = sequelize.define('MTLManga', {
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
    mangaId: {
        type: DataTypes.STRING, // Tipo de dato STRING para 'mangaId'.
        allowNull: false, // No puede estar vacío.
        references: {
            model: "Manga", // El campo hace referencia al modelo 'Manga'.
            key: 'mangaId', // Referencia al campo 'mangaId' en el modelo 'Manga'.
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
    tableName: 'mtlmanga', // El nombre de la tabla en la base de datos será 'mtlmanga'.
    timestamps: false // No se agregarán campos de tiempo como 'createdAt' o 'updatedAt'.
});

// Se exporta del modelo 'MTLManga' para usarlo en otras partes de la aplicación
export default MTLManga;

/* --------- CRUD -----------*/

/**
 * Función para agregar o actualizar el estado de un manga en la lista del usuario.
 * Si el manga ya está en la lista, solo se actualiza el estado.
 * Si no está en la lista, se agrega como nuevo manga con el estado proporcionado.
 * 
 * @param {number} userId - El ID del usuario al que pertenece la lista de mangas.
 * @param {Object} mangaData - Los datos del manga (ID, título, sinopsis, imagen, géneros).
 * @param {string} status - El estado del manga.
 * @returns {Promise} - Devuelve el manga con su estado actualizado o agregado.
 * @throws {Error} - Si ocurre un error al agregar o actualizar el manga en la base de datos.
 */
export async function addMangaStatus(userId, mangaData, status) {
    try {
        // Se busca o se crea un nuevo registro en la tabla 'mtlmanga' con el userId y mangaId proporcionados.
        const [manga, created] = await MTLManga.findOrCreate({
            where: { userId, mangaId: mangaData._id },
            defaults: {
                userId, // Establece el userId.
                mangaId: mangaData._id, // Establece el mangaId.
                title: mangaData.title, // Establece el título del manga.
                synopsis: mangaData.synopsis, // Establece la sinopsis del manga.
                image: mangaData.image, // Establece la imagen del manga.
                genres: mangaData.genres.join(', '), // Establece los géneros como una cadena separada por comas.
                status // Establece el estado del manga.
            }
        });

        // Si el registro ya existía, sólo se actualiza el estado.
        if (!created) {
            manga.status = status; // Se actualiza el estado del manga.
            await manga.save(); // Se guardan los cambios.
        }
        return manga; // Se devuelve el manga con su estado actualizado.
    } catch (error) {
        console.error("Error adding manga to the list:", error); // Manejo de errores.
        throw error;
    }
};

/**
 * Función para obtener la lista de mangas de un usuario específico.
 * 
 * @param {number} userId - El ID del usuario para obtener su lista de mangas.
 * @returns {Promise} - Devuelve la información de los mangas de la lista personal del usuario.
 * @throws {Error} - Si ocurre un error al obtener la lista de mangas desde la base de datos.
 */
export async function getUserMangaList(userId) {
    try {
        return await MTLManga.findAll({ where: { userId } });  // Se obtienen todos los mangas asociados con el userId.
    } catch (error) {
        console.error("Error retrieving the manga list:", error); // Manejo de errores.
        throw error;
    }
};

/**
 * Función para eliminar un manga de la lista de un usuario.
 * 
 * @param {number} userId - El ID del usuario que desea eliminar el manga de su lista.
 * @param {string} mangaId - El ID del manga a eliminar.
 * @returns {Promise<boolean>} - Devuelve true si el manga fue eliminado, o false si no se encontró.
 * @throws {Error} - Si ocurre un error al eliminar el manga desde la base de datos.
 */
export async function removeMangaFromList(userId, mangaId) {
    try {
        // Se elimina el manga especificado de la lista del usuario.
        const deleted = await MTLManga.destroy({
            where: { userId, mangaId } // Condición para encontrar el manga específico del usuario.
        });

        // Devuelce true si el manga fue eliminado, o false si no se encontró.
        return deleted > 0;
    } catch (error) {
        console.error("Error removing manga from the list:", error); // Manejo de errores.
        throw error;
    }
};
