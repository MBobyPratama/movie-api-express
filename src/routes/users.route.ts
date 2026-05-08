import { Router } from 'express';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from '../schemas/users.schema';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/users.controller';

const router = Router();

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Tambah user baru (Langsung)
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
 *         description: User berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 */
router.post('/', validateBody(createUserSchema), createUser);

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Mendapatkan semua user
 *     responses:
 *       200:
 *         description: Daftar user
 */
router.get('/', getAllUsers);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Mendapatkan detail user berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data detail user
 *       404:
 *         description: User tidak ditemukan
 */
router.get('/:id', validateParams(userIdSchema), getUserById);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update data user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Data user berhasil diupdate
 *       404:
 *         description: User tidak ditemukan
 */
router.put(
  '/:id',
  validateParams(userIdSchema),
  validateBody(updateUserSchema),
  updateUser,
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Menghapus user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *       404:
 *         description: User tidak ditemukan
 */
router.delete('/:id', validateParams(userIdSchema), deleteUser);

export default router;
