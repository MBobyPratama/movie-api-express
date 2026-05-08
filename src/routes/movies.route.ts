import { Router } from 'express';
import { validateBody } from '../middlewares/validation.middleware.js';
// import { createMovieSchema } from '../schemas/movies.schema.js';
import {
  createMovie,
  getAllMovies,
  deleteMovie,
} from '../controllers/movies.controller.js';
import { upload } from '../middlewares/upload.middleware.js';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /movies:
 *   get:
 *     tags: [Movies]
 *     summary: Mendapatkan semua film
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar film
 */
router.get('/', getAllMovies);

/**
 * @openapi
 * /movies:
 *   post:
 *     tags: [Movies]
 *     summary: Menambahkan film baru (Admin Only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, genre, releaseYear]
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *               poster:
 *                 type: string
 *                 format: binary
 *                 description: File gambar poster film
 *     responses:
 *       201:
 *         description: Film berhasil ditambahkan
 *       401:
 *         description: Akses ditolak (Token tidak ada/salah)
 *       403:
 *         description: Terlarang (Bukan admin)
 */
router.post(
  '/',
  verifyToken,
  authorizeRole(['admin']),
  upload.single('poster'),
  createMovie,
);

/**
 * @openapi
 * /movies/{id}:
 *   delete:
 *     tags: [Movies]
 *     summary: Menghapus film berdasarkan ID (Admin Only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Film dan poster berhasil dihapus
 *       404:
 *         description: Film tidak ditemukan
 */
router.delete('/:id', verifyToken, authorizeRole(['admin']), deleteMovie);

export default router;
