import fetch from 'node-fetch'; // Importación de node-fetch.

/**
 * Función para obtener los animes de la temporada actual desde la API de Jikan.
 * Realiza una solicitud a la API externa para obtener los animes de la temporada actual,
 * filtra la información relevante y la devuelve como una respuesta en formato JSON.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Devuelve una respuesta en formato JSON con los animes de temporada.
 */
export async function seasonalAnimes (req, res) {
    try {
        const response = await fetch('https://api.jikan.moe/v4/seasons/now');  // Hace un fetch a la API para obtener los animes de la temporada actual.

        const data = await response.json(); // Convierte la respuesta de la API en un JSON.
  
        const filteredData = data.data.map(anime => ({ // Filtra y mapea los datos para obtener solo los campos necesarios.
            title: anime.title, // Título del anime.
            image_url: anime.images.jpg.image_url, // URL de la imagen del anime.
            genres: anime.genres.map(genre => genre.name), // Lista de géneros del anime.
        }));
        
        res.json(filteredData); // Envia los datos filtrados como respuesta en formato JSON.
    } catch (error) {
        res.status(500).send('Error retrieving the seasonal animes');  // En caso de error, envia un mensaje de error con el código 500.
    }
};
