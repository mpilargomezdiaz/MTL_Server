import { Sequelize } from 'sequelize'; // Se importa Sequelize.
import dotenv from 'dotenv' // Se importa dotenv para cargar las variables de entorno del archivo .env
dotenv.config() // Se cargan las variables de entorno.

/**
 * Configuración para conectarse a MySQL.
 * 
 * @function MySQLConnection
 * @returns {Sequelize} Instancia de Sequelize configurada para conectarse a la base de datos MySQL.
 * @throws {Error} Lanza un error si las variables de entorno no están configuradas correctamente o si hay un problema con la conexión.
 */
export function MySQLConnection() {
    return new Sequelize(
        process.env.SQL_BBDD, // Nombre de la base de datos desde la variable de entorno.
        process.env.SQL_USER, // Usuario de MySQL desde la variable de entorno.
        process.env.SQL_PASS, // Contraseña de MySQL desde la variable de entorno.
        {
            host: process.env.SQL_LOCALHOST, // Host del servidor MySQL.
            dialect: 'mysql', // El tipo de base de datos (MySQL en este caso).
            port: 3306, // Puerto predeterminado para MySQL.
            logging: false, // Deshabilita los logs de las consultas en la consola.
        }
    );
}
