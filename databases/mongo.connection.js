import { MongoClient } from 'mongodb' // Para la conexión con MongoDB.
import dotenv from 'dotenv' // Para manejar las variables de entorno.

dotenv.config() // Se cargan las variables de entorno definidas en el archivo .env

const url = process.env.URI_MONGOLOCAL // Se declara la URL de conexión a la base de datos MongoDB, que se toma desde las variables de entorno.

// Gestiona las operaciones de conexión y cierre de conexión con MongoDB.

export default {

	/**
	 * Función para conectarse a la base de datos MongoDB.
	 *
	 * @returns {Promise<MongoClient>} Devuelve una promesa que resuelve en el cliente de MongoDB conectado.
	 * @throws {Error} Si no puede conectarse a la base de datos, lanza un error.
	 */
	connectToMongo: async () => {

		const client = new MongoClient(url);
		
		
		await client.connect(); // Se lleva a cabo la conexión al servidor de MongoDB.

		return client; // Se devuelve el cliente conectado.
	},

	/**
	 * Función que cierra la conexión con MongoDB.
	 *
	 * @returns {Promise<MongoClient>} Devuelve una promesa que resuelve en el cliente de MongoDB después de haber cerrado la conexión.
	 * @throws {Error} Si no puede cerrar la conexión, lanza un error.
	 */
	closeClient: async () => {
		const client = new MongoClient(url);

		await client.close(); // Se cierra la conexión con el cliente.

		return client; // Se devuelve el cliente cerrado.
	}
}
