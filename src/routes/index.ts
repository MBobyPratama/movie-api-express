import { Router } from 'express';
import usersRoute from './users.route.js';
import moviesRoute from './movies.route.js';

const router = Router();

// Semua route didaftarkan disini
router.use('/users', usersRoute);
router.use('/movies', moviesRoute);

export default router;
