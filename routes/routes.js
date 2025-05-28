import { Router } from 'express';
import animeInfo from '../controllers/MongoDB/animes.controllers.js';
import mangaInfo from '../controllers/MongoDB/mangas.controllers.js';
import { newUser, loginUser, updatePass, confirmPass } from '../controllers/MySQL/user.controllers.js';
import { addAnimes, getAnimeList, removeAnime, syncAndInsert } from '../controllers/MySQL/mtl.anime.controllers.js';
import { verifyRole, authenticateToken } from '../middlewares/auth.middleware.js';
import { syncAndInsertManga, addMangas, getMangaList, removeManga } from '../controllers/MySQL/mtl.manga.controllers.js';
import { seasonalAnimes } from '../controllers/generic.controllers.js';


const router = Router();

// Animes de temporada: API Jikan.

router.get('/magicaltsutsunlist/v1/seasonal-anime', seasonalAnimes )

/* Rutas para sincronizar e insertar los id de los animes/mangas.
De MongoDB a MySQL. */

router.get('/magicaltsutsunlist/v1/sync-and-insert-anime', syncAndInsert);

router.get('/magicaltsutsunlist/v1/sync-and-insert-manga', syncAndInsertManga);

// Base de datos de MongoDB.

router.get('/magicaltsutsunlist/v1/collections/animes', authenticateToken, animeInfo.allAnimes);

router.get('/magicaltsutsunlist/v1/collections/mangas', authenticateToken, mangaInfo.allMangas);

// Base de datos de MySQL.

router.post('/magicaltsutsunlist/v1/user/signup', newUser);

router.post('/magicaltsutsunlist/v1/user/login', loginUser);

router.post('/magicaltsutsunlist/v1/user/update-pass', updatePass);

router.post('/magicaltsutsunlist/v1/user/confirm-pass/:token', confirmPass);

router.post('/magicaltsutsunlist/v1/user/anime-status/add', authenticateToken, addAnimes);

router.get('/magicaltsutsunlist/v1/user/anime-status/list', authenticateToken, getAnimeList);

router.delete('/magicaltsutsunlist/v1/user/anime-status/remove/:animeId', authenticateToken, removeAnime);

router.post('/magicaltsutsunlist/v1/user/manga-status/add', authenticateToken, addMangas);

router.get('/magicaltsutsunlist/v1/user/manga-status/list', authenticateToken, getMangaList);

router.delete('/magicaltsutsunlist/v1/user/manga-status/remove/:mangaId', authenticateToken, removeManga);

// Rutas Admin. Base de datos: MongoDB.

router.post('/magicaltsutsunlist/v1/admin/anime-image/upload', animeInfo.postImageAnime, animeInfo.postImageARes)

router.post('/magicaltsutsunlist/v1/admin/new-anime/upload', animeInfo.postNewAnime);

router.post('/magicaltsutsunlist/v1/admin/manga-image/upload', mangaInfo.postImageManga, mangaInfo.postImageMRes)

router.post('/magicaltsutsunlist/v1/admin/new-manga/upload', mangaInfo.postNewManga);

router.get('/role', authenticateToken, (req, res) => {
    const userRole = req.user.role;
    
    res.json({ role: userRole });
});

export { router };