import { Router } from 'express';
import { validateBody } from '../middlewares/validation.middleware.js';
// import { createMovieSchema } from '../schemas/movies.schema.js';
import { createMovie, getAllMovies } from '../controllers/movies.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/', getAllMovies);
router.post('/', upload.single('poster'), createMovie);

export default router;
