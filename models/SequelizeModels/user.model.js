import { DataTypes, Sequelize } from 'sequelize';
import { MySQLConnection } from '../../databases/mysql.js'; // Se importa la función para establecer la conexión con MySQL.
import { Op } from 'sequelize'; // Operadores de Sequelize para las consultas.

const sequelize = MySQLConnection(); // Se establece la conexión con la base de datos MySQL.

// Definición del modelo de usuario.
const User = sequelize.define('User', {
    // Definición de los atributos del modelo 'User'.
    id: {
        type: DataTypes.INTEGER, // Tipo de dato INTEGER para el id.
        primaryKey: true, // Marca este campo como clave primaria.
        autoIncrement: true // La ID se autoincrementa.
    },
    isRegistered: {
        type: DataTypes.INTEGER, // Tipo de dato INTEGER.
        allowNull: false, // Este campo no puede estar vacío.
        defaultValue: 0 // El usuario no está registrado por defecto.
    },
    username: {
        type: DataTypes.STRING(100), // Tipo de dato STRING para el nombre del usuario.
        allowNull: false // El nombre de usuario no puede estar vacío.
    },
    email: {
        type: DataTypes.STRING(100), // Tipo de dato STRING para el email del usuario.
        allowNull: false, // Este campo no puede estar vacío.
        unique: true, // El email debe ser único.
        validate: {
            isEmail: {
                msg: "Must be a valid email address" // Validación para verificar que el campo 'email' sea una dirección de correo válida.
            }
        }
    },
    pass: {
        type: DataTypes.STRING(30), // Tipo de dato STRING para la contraseña del usuario.
        allowNull: false, // Este campo no puede estar vacío.
    },
    role: {
        type: DataTypes.STRING, // Tipo de dato STRING para el rol del usuario.
        allowNull: false, // Este campo no puede estar vacío.
        defaultValue: "otaku", // El rol por defecto es "otaku" (que correspondería al de un usuario sin permisos de administrador).
    },
}, {
    tableName: 'users', // El nombre de la tabla en la base de datos.
    timestamps: false // No se manejan automáticamente las marcas de tiempo (createdAt, updatedAt).
});

export default User; // Se exporta el modelo para poderlo utilizar en otras partes de la aplicación.

/// --------- CRUD ----------- ///

/**
 * Función para registrar un nuevo usuario en la base de datos.
 * 
 * @param {Object} model - El modelo de datos que se utiliza (en este caso, el modelo User).
 * @param {Object} data - Los datos del usuario a registrar, que incluyen sus atributos.
 * @returns {Object} El nuevo usuario registrado.
 * @throws {Error} Si ocurre un error durante el registro del usuario.
 */
export async function signUp(model, data) {
    try {
        const newUser = await model.create(data); // Se crea el usuario en la base de datos con sus datos personales.
        console.log('User registered:', newUser.toJSON()); // Si no se produce ningún error, se muestra en consola un mensaje con los datos del usuario registrado.
        return newUser; // Devuelve el nuevo usuario.
    } catch (error) {
        console.error('Error registering user', error); // Se corrige el mensaje de error.
        throw error; // Lanza el error.
    }
};

/**
 * Función del login de un usuario buscando su username o email junto con la contraseña.
 * 
 * @param {Object} model - El modelo de Sequelize que se utiliza.
 * @param {string} login - El username o email del usuario.
 * @param {string} pass - La contraseña del usuario.
 * @returns {Object} El usuario encontrado si las credenciales son correctas, o null si no se encuentra el usuario.
 * @throws {Error} Si ocurre un error durante la consulta.
 */
export async function loginU(model, login, pass) {
    try {
        const user = await model.findOne({ // Se busca el usuario
            where: {
                [Op.and]: [
                    { isRegistered: 1 }, // Tiene que cumplir las condiciones de estar registrado y de haber proporcionado una contraseña existente.
                    { pass: { [Op.eq] : Sequelize.literal(`BINARY '${pass}'`) } } // Para que distinga entre mayúsculas y minúsculas.
                ],
                [Op.or]: [
                    { email: login }, 
                    { username: { [Op.eq] : Sequelize.literal(`BINARY '${login}'`) } } // Para que distinga entre mayúsculas y minúsculas.
                ]
            },
            attributes: ['id', 'username', 'email', 'role']
        });

        return user; // Si se encuentra, se devuelve el usuario.
    } catch (e) {
        console.error("Error logging in: ", e); // Si se produce un error, se muestra el mensaje de error en consola.
        throw new Error('Error logging in'); // Lanza el error.
    }
};

/**
 * Función para obtener los datos de un usuario basado en su email
 * 
 * @param {Object} model - El modelo de Sequelize.
 * @param {string} email - El correo electrónico del usuario a buscar.
 * @returns {Promise<Object|null>} El usuario encontrado o null si no se encuentra.
 * @throws {Error} Si ocurre un error durante la consulta.
 */
export async function getUser(model, email) { 
    try {
        const user = await model.findOne({ // Se busca al usuario.
            where: {
                [Op.and]: [
                    { isRegistered: 1 }, // Tiene que cumplir las condiciones de estar registrado y de haber proporcionado un email existente.
                    { email: email }
                ]
            }
        });
        return user; // En caso de que no se produzca ningún error, devuelve el usuario.
    } catch (e) {
        console.error("Error finding user: ", e); // Si se produce un error, muestra un mensaje de error en consola.
        throw new Error('Error finding user'); // Lanza el error.
    }
};

/**
 * Función para obtener un usuario basado en su username o en su email.
 * 
 * @param {Object} model - El modelo de Sequelize.
 * @param {string} userInfo - El username o email del usuario a buscar.
 * @returns {Object} El usuario encontrado o null si no se encuentra.
 * @throws {Error} Si ocurre un error durante la consulta.
 */
export async function getOneUser(model, userInfo) {
    try {
        const user = await model.findOne({
            where: {
                [Op.and]: [
                    { isRegistered: 1 } // El usuario tiene que estar registrado.
                ],
                [Op.or]: [
                    { username: userInfo }, // El usuario tiene que haber proporcionado su username o su email.
                    { email: userInfo }
                ]
            }
        });

        if (!user) { // Si el usuario no existe, se muestra un mensaje de error en la consola.
            console.log(`User with username or email "${userInfo}" not found.`);
            return null; // Se devuelve null.
        }

        return user; // Si el usuario existe, se devuelve el usuario.
    } catch (error) {
        console.error(`Error finding user with username or email "${userInfo}":`, error.message); // Si se produce un error, se muestra un mensaje de error en la consola.
        throw new Error('Error querying the database'); // Se lanza el error.
    }
};

/**
 * Función para actualizar la contraseña de un usuario.
 * 
 * @param {Object} model - El modelo de Sequelize.
 * @param {string} pass - La nueva contraseña del usuario.
 * @param {string} email - El email del usuario cuya contraseña se actualizará.
 * @returns {Promise<Array>} Los resultados de la actualización.
 * @throws {Error} Si ocurre un error durante la actualización.
 */
export async function updateUser(model, pass, email) {
    try {
        const updatedUser = await model.update(
            { pass: pass },
            {
                where: {
                    [Op.and]: [
                        { isRegistered: 1 }, // El usuario tiene que estar registrado y haber proporcionado un email existente en la base de datos.
                        { email: email }
                    ]
                }
            });

        console.log('Password updated:'); // Si no se produce ningún error, se muestra un mensaje de éxito en la consola.
        return updatedUser; // Se devuelve el usuario con sus datos actualizados.
    } catch (e) {
        console.error("Error updating the user's password: ", e); // Si se produce un error, se muestra un mensaje de error en la consola.
        throw new Error('Error updating password.'); // Se lanza el error.
    }
};
