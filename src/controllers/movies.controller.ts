import { Request, Response } from 'express';
import { eq, ilike } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { moviesTable } from '../db/schema';

const db = drizzle(process.env.DATABASE_URL!);

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    // Implementasi req.query untuk filter (Dynamic Routing)
    const genreFilter = req.query.genre as string;

    let query = db.select().from(moviesTable);

    // Jika user mengirim query ?genre=action
    if (genreFilter) {
      // @ts-ignore - mengabaikan tipe Drizzle Builder sementara
      query = query.where(ilike(moviesTable.genre, `%${genreFilter}%`));
    }

    const movies = await query;
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    const title = req.body.title;
    const genre = req.body.genre;
    const releaseYear = parseInt(req.body.releaseYear);
    const posterUrl = req.file ? req.file.path : null;
    const newMovie = await db
      .insert(moviesTable)
      .values({ title, genre, releaseYear, posterUrl })
      .returning();
    res.status(201).json(newMovie[0]);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
};
