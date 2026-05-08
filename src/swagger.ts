import { desc } from 'drizzle-orm';
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie API',
      version: '1.0.0',
      description: 'API untuk mengelola data film',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development lokal',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Gunakan token JWT untuk otentikasi. Format: "Bearer"',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path ke file route untuk mendeteksi anotasi Swagger
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
