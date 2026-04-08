import { Router } from 'express';
import { validateBody } from '../middlewares/validation.middleware.js';
// import { createMovieSchema } from '../schemas/movies.schema.js';
import { createMovie, getAllMovies } from '../controllers/movies.controller.js';
import { upload } from '../middlewares/upload.middleware.js';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllMovies);
router.post(
  '/',
  verifyToken,
  authorizeRole(['admin']),
  upload.single('poster'),
  createMovie,
);

export default router;
