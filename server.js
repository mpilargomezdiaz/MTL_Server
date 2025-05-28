import express, { json, urlencoded } from 'express'; // Se importa Express para manejar las peticiones.
import cors from 'cors'; // Middleware para habilitar CORS.
import { router } from './routes/routes.js'; // Se importan las rutas de la aplicación.
import dotenv from 'dotenv'; // Para cargar las variables de entorno desde el archivo .env
dotenv.config(); // Se cargan las variables de entorno.
import { connectToDatabase } from './databases/mysql.connection.js'; // Se importa la función para conectarse a la base de datos de MySQL.
import swaggerUi from "swagger-ui-express"; // Se importa Swagger para la documentación de la API.
import swaggerDocs from "./utils/Swagger/swaggerOptions.js"; // Configuración de Swagger.
import path from "path"; // Módulo de Node.js para trabajar con rutas de archivos.
import { fileURLToPath } from "url"; // Módulo para convertir la URL en ruta de archivo.

const app = express(); // Crear la instancia de la aplicación Express.


/**
 * Configuración de Swagger para mostrar la documentación de la API en '/api-docs'.
 * 
 * @param {string} "/api-docs" - La ruta donde se muestra la documentación.
 * @param {function} swaggerUi.serve - Middleware de Swagger UI.
 * @param {object} swaggerDocs - La configuración de Swagger para la API.
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(json()); // Middleware para procesar cuerpos de las peticiones en formato JSON.

app.use(urlencoded({ extended: false })); // Middleware para procesar cuerpos de las peticiones con URL encoded (formularios HTML).

app.use(cors()); // Middleware para habilitar CORS (permitir peticiones de diferentes orígenes).

app.use(router); // El enrutado.

// Establecer directorio estático para las imágenes.
const filename = fileURLToPath(import.meta.url); // Obtener el nombre de la imagen.
const dirname = path.dirname(filename); // Obtener el directorio de la imagen.
app.use(express.static(path.join(dirname, 'public'))); // Hacer accesibles los archivos estáticos en la carpeta 'public'.

const port = process.env.PORT; // Obtener el puerto desde las variables de entorno.

/**
 * Función para iniciar el servidor y conectar a la base de datos.
 * 
 * @function startServer
 * @throws {Error} Si ocurre un error durante la conexión a la base de datos o el inicio del servidor.
 */
async function startServer() {
  try {
      await connectToDatabase(); // Conexión a la base de datos.
      
      // Una vez se conecta a la base de datos, inicia el servidor en el puerto indicado.
      app.listen(port, () => {
          console.log(`Server running on port ${port}`); // Muestra en la consola que el servidor está corriendo.
      });
  } catch (error) {
      console.error('Error starting the server:', error); // Si ocurre un error al iniciar el servidor, muestra el error en la consola.
  }
}

startServer(); // Se llama a la función para inicializar el servidor.

