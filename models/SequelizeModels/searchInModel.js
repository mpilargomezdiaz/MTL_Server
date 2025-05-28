import { loginU, getOneUser } from '../../models/SequelizeModels/user.model.js'; // Se importan las funciones necesarias desde el modelo User.
import jwt from 'jsonwebtoken'; // El token.
import dotenv from 'dotenv'; // Importación de dotenv para manejar las variables de entorno.

dotenv.config(); // Se cargan las variables de entorno del archivo .env

/**
 * Función para buscar un usuario en el modelo y generar el token si las credenciales son correctas.
 * 
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Object} model - El modelo de la base de datos donde se busca el usuario.
 * @param {string} login - El username o correo electrónico del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {boolean} Devuelve 'true' si el usuario no existe, 'false' si el proceso fue exitoso.
 * @throws {Error} Si ocurre un error al generar el token o al obtener los datos del usuario.
 */
export async function searchInModels(res, model, login, password) {
    try {
        // Llamada a la función 'loginU' para verificar si las credenciales (login y password) coinciden con un usuario.
        let user = await loginU(model, login, password);

        // Si no se encuentra el usuario, se devuelve una respuesta indicando que el usuario no existe.
        if (!user) {
            console.log("No existe"); // Mensaje en consola para indicar que no se encontró el usuario.
            return true; // Devuelve 'true' indicando que hubo un error (usuario no encontrado).
        } else {
            console.log("Usuario existente"); // Mensaje en la consola para indicar que el usuario fue encontrado.

            // Si el usuario existe, se obtiene la información completa del usuario utilizando la función 'getOneUser'.
            const completeUser = await getOneUser(model, login);
            const userName = completeUser.email; // Se obtiene el correo del usuario como 'userName'.
            const tokenFrom = { id: user.id, role: user.role, userName }; // Se declara la información del usuario que queremos almacenar en el token.

            // Se genera el token con los datos del usuario
            jwt.sign(tokenFrom, process.env.SECRET_KEY, { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    return res.status(401).json({ error: 'Invalid username and/or password.' });  // Si ocurre un error en la generación del token, se responde con un mensaje de error 401.
                }

                // Si el token se genera correctamente, se prepara la respuesta con el token generado.
                const response = {
                    message: '---- User logged in successfully. ------',
                    token: 'Bearer ' + token // Se incluye el token en el encabezado 'Bearer'.
                }

                return res.status(202).json(response); // Se devuelve el token y un mensaje de éxito.
            });
            return false; // Si todo salió bien, se retorna 'false' indicando que no hubo ningún error.
        }
    } catch (error) {
        console.error("Error searching for user:", error); // Mensaje de error en la consola.
        return res.status(500).json({ error: 'There was a problem processing the request.' }); // En caso de error se obtiene una respuesta 500.
    }
}
