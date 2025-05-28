import { MySQLConnection } from './mysql.js' // Se importa la configuración de MySQL.

// Se importan los modelos de Sequelize.
import User from '../models/SequelizeModels/user.model.js';
import Anime from '../models/SequelizeModels/anime.model.js';
import Manga from '../models/SequelizeModels/manga.model.js';
import MTLAnime from '../models/SequelizeModels/mtlAnime.model.js';
import MTLManga from '../models/SequelizeModels/mtlManga.model.js';

// Llamada a la conexión de MySQL.
const sequelize = MySQLConnection();

/**
 * Se encarga de la configuración de MySQL y de la sincronización de los modelos de Sequelize. También se
 * establecen las relaciones entre los modelos.
 * 
 * @async
 * @function connectToDatabase
 * @throws {Error} Si falla la conexión o la sincronización.
 * @returns {void} No devuelve ningún valor. Sólo te muestra un console.log
 */
export async function connectToDatabase() {
  try {
      // Se autentica la conexión con la base de datos
      await sequelize.authenticate();
      console.log('Conexión establecida correctamente.');

      // Se definen las relaciones entre los modelos.

      // Relación muchos a muchos entre User y Anime a través de la tabla MTLAnime.
      User.belongsToMany(Anime, { through: MTLAnime, foreignKey: 'userId', otherKey: 'animeId' });
      Anime.belongsToMany(User, { through: MTLAnime, foreignKey: 'animeId', otherKey: 'userId' });
      MTLAnime.belongsTo(User, { foreignKey: 'userId' });
      MTLAnime.belongsTo(Anime, { foreignKey: 'animeId' });

      // Relación muchos a muchos entre User y Manga a través de la tabla MTLManga.
      User.belongsToMany(Manga, { through: MTLManga, foreignKey: 'userId', otherKey: 'mangaId' });
      Manga.belongsToMany(User, { through: MTLManga, foreignKey: 'mangaId', otherKey: 'userId' });
      MTLManga.belongsTo(User, { foreignKey: 'userId' });
      MTLManga.belongsTo(Manga, { foreignKey: 'mangaId' });
      
      // Se sincronizan los modelos con la base de datos (si no existen las tablas, se crean).
      await User.sync();
      await Anime.sync();
      await Manga.sync();
      await MTLAnime.sync();
      await MTLManga.sync(); 

      console.log('Modelos correctamente sincronizados con la base de datos.');
  } catch (error) {
      // Si ocurre algún error, se muestra en la consola.
      console.error('No se pudo conectar a la base de datos:', error);
  }
}
