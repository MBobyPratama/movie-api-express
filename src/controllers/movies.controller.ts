import { Request, Response } from 'express';
import { eq, ilike } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { v2 as cloudinary } from 'cloudinary';
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

    // Perubahan di sini: Ambil URL Cloudinary dari req.file.path
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

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    // 1. Cari film di DB untuk mendapatkan posterUrl
    const movie = await db
      .select()
      .from(moviesTable)
      .where(eq(moviesTable.id, id));

    if (movie.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const targetMovie = movie[0];

    // 2. Jika punya posterUrl, hapus file dari Cloudinary
    if (targetMovie.posterUrl) {
      // Trik mengekstrak public_id dari URL gambar Cloudinary
      // Contoh URL: https://res.cloudinary.com/.../image/upload/v1234/movie-api/posters/abcde.jpg
      const urlParts = targetMovie.posterUrl.split('/');
      const filenameWithExt = urlParts[urlParts.length - 1]; // abcde.jpg
      const folderName = urlParts[urlParts.length - 2]; // posters
      const parentFolder = urlParts[urlParts.length - 3]; // movie-api

      const fileName = filenameWithExt.split('.')[0]; // abcde
      const publicId = `${parentFolder}/${folderName}/${fileName}`; // movie-api/posters/abcde

      // Menghapus dari awan
      await cloudinary.uploader.destroy(publicId);
    }

    // 3. Setelah aman, baru hapus data dari Database
    await db.delete(moviesTable).where(eq(moviesTable.id, id));

    res.json({ message: 'Movie and poster deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
};
