import { Router } from 'express';
import { validateBody } from '../middlewares/validation.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import {
  register,
  login,
  logout,
  createAdmin,
} from '../controllers/auth.controller.js';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrasi user baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, age, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Email sudah terdaftar / Validasi gagal
 */
router.post('/register', validateBody(registerSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token
 *       401:
 *         description: Email atau password salah
 */
router.post('/login', validateBody(loginSchema), login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     responses:
 *       200:
 *         description: Logout berhasil
 */
router.post('/logout', logout); // Belum ada implementasi logout, tapi endpoint sudah disiapkan

/**
 * @openapi
 * /auth/create-admin:
 *   post:
 *     tags: [Auth]
 *     summary: Buat user dengan role admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, age, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin berhasil dibuat
 */
router.post('/create-admin', validateBody(registerSchema), createAdmin);

export default router;
