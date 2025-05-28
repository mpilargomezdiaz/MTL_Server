import { expect, test, afterAll } from '@jest/globals'; // Importación necesaria para las pruebas.
import { addAnimeStatus, removeAnimeFromList } from '../models/SequelizeModels/mtlAnime.model.js'; // Se importan las funciones que se van a probar.
import { MySQLConnection } from '../databases/mysql.js'; // Importación para la conexión a MySQL.

const sequelize = MySQLConnection(); // Se establece la conexión.

// Datos del anime.
const animeData = {
    _id: '67cf0157362455cec9bd66f0', // ID del anime (Que procede de la base de datos de MongoDB).
    title: 'Ojamajo Doremi', // Nombre del anime.
    synopsis: 'Harukaze Doremi considers herself to be the unluckiest girl in the world. Su vida cambiaría si tuviera magia.', // Sinopsis.
    image: '/uploads/animes/anime1.jpg', // Imagen del anime.
    genres: ['Comedy'] // Género del anime.
};

// Primer test (Añadir un anime a la lista personal del usuario).

test('Se tiene que poder agregar un anime si no está en la lista personal del usuario', async () => {
    // Al poner como estado "Watching", se añade el anime a la lista del usuario con ID 1.
    const result = await addAnimeStatus(1, animeData, 'Watching');

    // Se verifica que el usuario asociado sea el correcto.
    expect(result.userId).toBe(1);
    // Se comprueba que el ID del anime guardado sea el correcto.
    expect(result.animeId).toBe(animeData._id);
    // Y, por último, se comprueba que el estado sea 'Watching'.
    expect(result.status).toBe('Watching');
});

// Segundo test (actualizar el estado de un anime que ya estaba en la lista personal del usuario).

test('Se tiene que actualizar el estado si el anime ya existe en la lista personal del usuario', async () => {
    // Primero se añade a la lista el anime con estado 'Watching'.
    await addAnimeStatus(1, animeData, 'Watching');
    // Después se prueba que se actualiza al establecer el estado 'Completed'.
    const result = await addAnimeStatus(1, animeData, 'Completed');

    // Por último se comprueba que el estado haya cambiado a 'Completed'.
    expect(result.status).toBe('Completed');
});

// Tercer test (eliminar un anime de la lista personal del usuario al seleccionar el estado 'Drop').


test('Tiene que eliminarse el anime de la lista personal del usuario en caso de que el estado del anime sea Drop', async () => {
    // Primero se añade a la lista el anime con estado 'Watching'.
    await addAnimeStatus(1, animeData, 'Watching');
    // Luego se modifica por el estado 'Drop'. Esto debería eliminarlo de la lista.
    await addAnimeStatus(1, animeData, 'Drop');

    // Se prueba su eliminación esperando que la respuesta sea 'true'.
    const result = await removeAnimeFromList(1, animeData._id);
    expect(result).toBe(true); // Se confirma que el anime fue eliminado de la lista personal del usuario.
});

// Finalmente se cierra la conexión de la base de datos. 

afterAll(async () => {
    await sequelize.close();
});
