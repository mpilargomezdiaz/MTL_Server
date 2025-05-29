# MagicalTsutsunList - Backend

Proyecto final: API RESTful en Node.js con Express que gestiona usuarios, autenticación JWT, y catálogo de animes/mangas con roles de usuario (otaku y super-otaku).

---

## Descripción

Este backend proporciona:

- Registro, autenticación y gestión de usuarios con JWT.  
- Diferenciación entre usuarios estándar (otaku) y administradores (super-otaku).  
- Gestión del catálogo de animes y mangas, almacenados en MongoDB (colecciones de animes y mangas). 
- Gestión del estado y almacenamiento en la lista personal de anime/manga a través de MySQL. 
- Almacenamiento y manejo de usuarios en MySQL (tabla de usuarios).  
- Funcionalidad para que los super-otakus añadan nuevos animes/mangas.  
- Soporte para envío de emails mediante Nodemailer (configurable con variables de entorno).  
- Documentación API con Swagger.  
- Testing con Jest y configuración para Babel.  

---

## Tecnologías y Dependencias principales

- Node.js  
- Express  
- MongoDB (mongoose)  
- MySQL (mysql2 + Sequelize)  
- JSON Web Tokens (jsonwebtoken)  
- Nodemailer  
- CORS  
- Multer (para uploads)  
- Swagger-jsdoc + Swagger-ui-express para documentación  
- Jest + Babel para testing  
- Nodemon para desarrollo  
- Selenium WebDriver, Chromedriver y Geckodriver para pruebas 

---

## Cómo ejecutar

1. Clona el repositorio.

2. Instala las dependencias con npm install.

3. Configura las variables de entorno (crea un archivo .env).

```env

# Port
PORT=3001

# MongoDB
URI_MONGOLOCAL='mongodb://127.0.0.1:27017/'
MONGO_BBDD='magicaltsutsunlist'

## MongoDB - Collections
COLL_1='mtl_anime'
COLL_2='mtl_manga'

# MySQL
SQL_LOCALHOST='localhost'
SQL_HOST='192.168.12.27'
SQL_USER=tu_usuario_mysql
SQL_PASS=tu_password_mysql
SQL_BBDD='magicaltsutsunlist'

## MySQL - Tables
TAB_MTL='users'

# JWT SecretKey
SECRET_KEY='secretkey'

# Nodemailer
EMAIL_USER=tu_email
EMAIL_PASS=tu_password_email

```

4. Restaura las colecciones de MongoDB localmente:

- Descarga las herramientas MongoDB Database Tools [aquí](https://www.mongodb.com/try/download/database-tools).

- Descomprime el archivo descargado y ubícalo en el directorio de instalación de MongoDB (por ejemplo, C:\Program Files\MongoDB\Tools).

- Ejecuta en la terminal:

```bash

mongorestore --db nombre_de_tu_base_de_datos C:\ruta\del\directorio\descomprimido\nombre_de_tu_base_de_datos

```

- Cambia nombre_de_tu_base_de_datos y la ruta según tu configuración.

5. Ejecuta npm start.

```md
**¡Importante!**

Para que los animes y mangas se sincronicen correctamente con la lista personal del usuario (estado: watching, completed, etc.), deberás hacer una petición GET a las siguientes rutas después de iniciar el servidor:

- **Anime:** `http://localhost:3001/magicaltsutsunlist/v1/sync-and-insert-anime`  
- **Manga:** `http://localhost:3001/magicaltsutsunlist/v1/sync-and-insert-manga`

> Nota: el puerto 3001 puede variar según tu variable `PORT` en el `.env`.

```

3001 puede cambiar según la configuración de las variables de entorno.

## Documentación

Accede a la documentación Swagger desde:  
[http://localhost:PORT/api-docs](http://localhost:PORT/api-docs)

## Probar Selenium: registro de 50 usuarios

```bash

node test/testSignUp.js

```

---

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) License. See the [LICENSE](./LICENSE) file for details.

You can freely use, copy, and modify this code for non-commercial purposes, but commercial use is not permitted.

---

## 📢 Legal Notice

This project uses data and images from MyAnimeList exclusively for educational and portfolio purposes.

It is not affiliated with MyAnimeList or the content owners. All rights to names, images, and descriptions belong to their respective owners.
