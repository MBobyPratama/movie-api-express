import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable } from '../db/schema.js';

const db = drizzle(process.env.DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara_123';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, age, email, password, role } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user baru
    const newUser = await db
      .insert(usersTable)
      .values({
        name,
        age,
        email,
        password: hashedPassword,
        role: role || 'admin',
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
      });

    res.status(201).json({ message: 'Registrasi berhasil', user: newUser[0] });
  } catch (error) {
    next(error); // Lempar ke global exception handler
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (user.length === 0) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Generate JWT
    const payload = {
      id: user[0].id,
      role: user[0].role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login berhasil', token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  // Stateless JWT tidak bisa benar-benar di-logout dari server kecuali pakai blacklist.
  // Untuk level pemula: kita cukup beri response sukses, klien yang harus hapus tokennya.
  res.json({ message: 'Logout berhasil. Silakan hapus token di sisi klien.' });
};

export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, age, email, password } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user baru dengan role 'admin'
    const newAdmin = await db
      .insert(usersTable)
      .values({
        name,
        age,
        email,
        password: hashedPassword,
        role: 'admin',
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        age: usersTable.age,
        role: usersTable.role,
      });

    res
      .status(201)
      .json({ message: 'Admin berhasil dibuat', user: newAdmin[0] });
  } catch (error) {
    next(error);
  }
};
