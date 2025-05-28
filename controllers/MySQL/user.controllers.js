// import { signUp } from '../../models/SequelizeModels/user.model.js'; 
import { signUp, getUser, updateUser } from '../../models/SequelizeModels/user.model.js'; // Importación de las funciones del modelo User.
import User from '../../models/SequelizeModels/user.model.js'; // Importación del modelo User.
import jwt from 'jsonwebtoken'; // El token.
import { searchInModels } from '../../models/SequelizeModels/searchInModel.js'; // Importación de la función para verificar la existencia de un usuario en la base de datos.
import nodemailer from 'nodemailer'; // Importación de nodemailer para el envío del correo de cambio de contraseña

/* ------------- FUNCIONES ----------------*/


/**
 * Función para registrar un nuevo usuario en la base de datos.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta en formato JSON con el mensaje de éxito o de error.
 */
export async function newUser(req, res) {
    try {
        const { username, email, pass, role } = req.body; // Datos del nuevo usuario.

        const data = {
            isRegistered: true,  // Indica si el usuario está registrado.
            username,            // Nombre del usuario.
            email,               // Correo electrónico.
            pass,                // Contraseña.
            role                 // Rol del usuario.
        };

        const newUser = await signUp(User, data); // Se registra al nuevo usuario en la base de datos.

        if (!newUser) {
            return res.status(501).json({ message: 'The user already exists.' }); // Si ya existe el usuario, devuelve un mensaje de error 501.
        }

        return res.status(201).json({ // Si no existe y no se produce ningún error, responde con un mensaje de éxito.
            message: 'New user registered successfully.',
            user: newUser
        });

    } catch (error) {
        console.error('Error registering the user: ', error); 
        res.status(500).json({ message: 'Error registering the user', error }); // En caso de error, responde con un mensaje de error 500.
    }
};

/**
 * Función de inicio de sesión de un usuario verificando sus credenciales.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void}
 */
export async function loginUser (req, res) {
    
    try {
        const { login, password } = req.body; // Datos del login y contraseña.

        // Verifica si el usuario existe en la base de datos.
        if (await searchInModels(res, User, login, password)) {
            return res.status(404).json({ error: 'The user does not exist.' }); // Si no existe, devuelve un mensaje de error 404.
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message }); // En caso de error, responde con un mensaje de error 500.
    }
};

/**
 * Función que solicita la actualización de la contraseña de un usuario enviando un token para la validación.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta en formato JSON con el token para cambiar la contraseña.
 */
export async function updatePass(req, res) {
    try {
        // Se extrae el email del cuerpo de la solicitud
        const { email } = req.body;

        // Se valida que el campo de email esté presente
        if (!email) {
            return res.status(400).json({ message: "The email field is required." });
        }

        // Se obtiene el usuario asociado al email proporcionado
        const user = await getUser(User, email);

        // Si no se encuentra el usuario, se devuelve un error 404
        if (!user || user.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        // Se genera un token JWT con una validez de 15 minutos
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "15m" });

        // Se construye el enlace de recuperación de contraseña
        const resetLink = `http://localhost:3000/reset-password/${token}`;

        // Se configura el transporte SMTP para enviar correos a través de Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Se obtiene el nombre de usuario para personalizar el mensaje
        const username = user.dataValues.username;

        // Se definen las opciones del correo, incluyendo contenido HTML estilizado
        const mailOptions = {
            from: '"Support" <no-reply@yourapp.com>',
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="
                        max-width: 600px;
                        margin: auto;
                        background-color: #ffffff;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(117, 0, 74, 0.307);
                        border-left: 10px solid #ff00ae62;
                    ">
                        <h2 style="color: #75004a; text-align: center;">🐼 Hello ${username} 🐼</h2>
                        <p style="font-size: 16px; color: #333; text-align: center;">
                            We received a request to reset your password. Don’t worry, it happens!
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" style="
                                background-color: #ff00ae62;
                                color: #ffffff;
                                padding: 12px 25px;
                                text-decoration: none;
                                border-radius: 5px;
                                font-weight: bold;
                                display: inline-block;
                            ">
                                🌸 Reset Password 🌸
                            </a>
                        </div>
                        <p style="font-size: 14px; color: #666; text-align: center;">
                            This link will be valid for <strong>15 minutes</strong>.<br>
                            If you didn’t request a password reset, you can safely ignore this email.
                        </p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 12px; color: #aaa; text-align: center;">
                            &copy; ${new Date().getFullYear()} YourKawaiiApp. All rights reserved.
                        </p>
                    </div>
                </div>
            `
        };

        // Se envía el correo con las instrucciones de restablecimiento
        await transporter.sendMail(mailOptions);

        // Se responde con éxito si el correo se ha enviado correctamente
        return res.status(200).json({
            message: "Email sent with password reset instructions."
        });

    } catch (error) {
        // Se captura cualquier error durante el proceso y se informa al cliente
        console.log("Error sending password reset email: ", error);
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * Función para confirmar la actualización de la contraseña utilizando el token.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta en formato JSON con el mensaje de éxito o de error.
 */
export async function confirmPass(req, res) {
    try {
        
        jwt.verify(req.params.token, process.env.SECRET_KEY, (err, token) => { // Verifica el token recibido en los parámetros de la URL.
            if (err) {
                console.log("Error validating the token: ", err);
                return res.status(500).json({ message: "Error validating the token", error: err });
            }

            const { email } = token; // Se obtiene el email a través del token decodificado.
            const { pass } = req.body; // Se obtiene la nueva contraseña del cuerpo de la solicitud.

            updateUser(User, pass, email); // Se actualiza la contraseña del usuario en la base de datos.

            return res.status(200).json({ message: 'Password updated successfully.' }) // Si no se produce ningún error, responde con un mensaje de éxito 200.
        })
    } catch (error) {
        console.log("Error confirming the password: ", error);
        res.status(500).json({ message: "Server error", error }); // Si se produce algún error, responde con un mensaje de error 500.
    }
};
