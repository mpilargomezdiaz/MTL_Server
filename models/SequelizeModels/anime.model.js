import { DataTypes } from 'sequelize'; // Se importa DataTypes desde Sequelize para definir los tipos de datos en el modelo.
import { MySQLConnection } from '../../databases/mysql.js'; // Se importa la función para establecer la conexión con MySQL.


const sequelize = MySQLConnection(); // Se establece la conexión con la base de datos MySQL.

// Definición del modelo 'Anime' que será usado para interactuar con la tabla 'animes' en MySQL.
const Anime = sequelize.define('Anime', {
    // Definición del campo 'animeId' que será la clave primaria.
    animeId: {
        type: DataTypes.STRING, // Tipo de datos STRING para el ID del anime.
        primaryKey: true, // Este campo es la clave primaria de la tabla.
        allowNull: false, // Este campo no puede estar vacío.
    }
}, {
    // Configuración de la tabla que utilizará este modelo.
    tableName: 'animes', // El nombre de la tabla en la base de datos será 'animes'.
    timestamps: false // Desactiva la creación automática de campos 'createdAt' y 'updatedAt'.
});

export default Anime; // Exportación del modelo Anime para poder utilizarlo en otras partes de la aplicación
