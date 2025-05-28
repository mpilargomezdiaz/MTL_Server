import jwt from 'jsonwebtoken'; // Token.
import dotenv from 'dotenv'; // Se importa dotenv para cargar las variables de entorno del archivo .env
dotenv.config(); // Se cargan las variables de entorno.

/**
 * Middleware que verifica si el rol del usuario tiene permiso para acceder a una ruta.
 * 
 * @param {string[]} - Lista de roles permitidos para acceder a la ruta.
 * @returns {Function} Middleware que verifica el token y el rol del usuario.
 * @throws {401} Si el token es inválido.
 * @throws {403} Si el token no está presente o el rol del usuario no tiene permisos para acceder.
 */
export function verifyRole(allowedRoles) {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1]; // Para obtener el token.

        if (!token) {
            return res.status(403).json({ error: "Access denied." }); // Si no encuentra el token, lanza un mensaje de error 403.
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid token." }); // Si encuentra el token, pero no es válido, lanza un mensaje de error 401.
            }

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ error: "You do not have permission to access this route." }); // Si el rol no tiene permisos de acceso, devuelve un mensaje de error 403.
            }

            req.user = decoded;
            next();
        });
    };
}

/**
 * Middleware que autentica al usuario.
 * 
 * @returns {Function} Middleware que verifica el token.
 * @throws {403} Si el token no es válido o no está presente.
 */
export function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1]; // Se obtiene el token.

    if (!token) {
        return res.status(403).json({ message: "You are not authenticated. Please log in." }); // Si no encuentra el token, lanza un mensaje de error 403.
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' }); // Si el token no es válido, envía un mensaje de error 403.
        }

        req.user = user;
        next();
    });
}
