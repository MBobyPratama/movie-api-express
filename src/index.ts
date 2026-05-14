import 'dotenv/config'; 
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'; 
import swaggerSpec from './swagger.js';
import appRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Middleware CORS SEBELUM route apapun
// Opsi 1 (Development): Mengizinkan semua origin
// Opsi 2 (Production): Hanya mengizinkan domain frontend tertentu
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://domain-frontend-capstone-kalian.vercel.app'] // Ganti dengan domain frontend asli nanti
    : '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Setup Swagger UI untuk dokumentasi API
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Menghubungkan semua route dari folder routes 
app.use('/api', appRoutes);

// Global Error Handler 
app.use((err: any, req: Request, res: Response, next: NextFunction) => { 
  console.error('Error tertangkap di Global Handler:', err); 

  const statusCode = err.status || 500; 
  const message = err.message || 'Terjadi kesalahan pada server'; 

  res.status(statusCode).json({
    error: message, 
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}`); 
  });
}

export default app;