import swaggerJsDoc from "swagger-jsdoc";
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const animesSwagger = YAML.load(path.resolve(__dirname, './animes.yaml'));
const mangasSwagger = YAML.load(path.resolve(__dirname, './mangas.yaml'));
const usersSwagger = YAML.load(path.resolve(__dirname, './users.yaml'));
const adminSwagger = YAML.load(path.resolve(__dirname, './admin.yaml'));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "MagicalTsutsunList - API Documentación",
      version: "1.0.0",
      description: "Documentación de la API con Swagger",
      contact: {
        name: "Pili",
      },
    },
    tags: [
      { name: 'Animes', description: 'Operaciones relacionadas con los animes' },
      { name: 'Mangas', description: 'Operaciones relacionadas con los mangas' },
      { name: 'Users', description: 'Operaciones relacionadas con los usuarios' },
      { name: 'Admin', description: 'Operaciones relacionadas con los permisos del administrador' }
    ],
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./utils/Swagger/*.yaml"],
};

const swaggerDocs = swaggerJsDoc({
  ...swaggerOptions,
  definition: {
    ...swaggerOptions.definition,
    paths: {
      ...animesSwagger.paths,
      ...mangasSwagger.paths,
      ...usersSwagger.paths,
      ...adminSwagger.paths
    },
  },
});
export default swaggerDocs;

