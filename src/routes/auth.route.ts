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

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout); // Belum ada implementasi logout, tapi endpoint sudah disiapkan
router.post('/create-admin', validateBody(registerSchema), createAdmin);

export default router;
