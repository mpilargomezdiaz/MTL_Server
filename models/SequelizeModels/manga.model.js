import { DataTypes } from 'sequelize'; // Se importa DataTypes desde Sequelize para definir los tipos de datos en el modelo.
import { MySQLConnection } from '../../databases/mysql.js'; // Se importa la función para establecer la conexión con MySQL.


const sequelize = MySQLConnection(); // Se establece la conexión con la base de datos MySQL.

// Definición del modelo 'Manga' que será usado para interactuar con la tabla 'mangas' en MySQL.
const Manga = sequelize.define('Manga', {
    // Definición del campo 'mangaId' que será la clave primaria.
    mangaId: {
        type: DataTypes.STRING, // Tipo de datos STRING para el ID del manga.
        primaryKey: true, // Este campo es la clave primaria de la tabla.
        allowNull: false, // Este campo no puede estar vacío.
    }
}, {
    // Configuración de la tabla que utilizará este modelo.
    tableName: 'mangas', // El nombre de la tabla en la base de datos será 'mangas'.
    timestamps: false // Desactiva la creación automática de campos 'createdAt' y 'updatedAt'.
});

export default Manga; // Exportación del modelo Manga para poder utilizarlo en otras partes de la aplicación
