import express, { Request, Response } from "express";
import { pool } from "./db";

const PORT = 3000;
const app = express();

app.use(express.json());

app.post('/add-user', async (req: Request, res: Response) => {
  const { nama, email } = req.body;

  if (!nama || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const queryText = 'INSERT INTO users(nama, email) VALUES($1, $2) RETURNING *';
    const values = [nama, email];
    const result = await pool.query(queryText, values);

    res.status(201).json({
      message: 'User added successfully',
      user: result.rows[0],
    });
  } catch (err: any) {
    console.error('Error adding user:', err);
    if (err.code === '23505') { // Unique violation
      res.status(409).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});