import { z } from 'zod';

export const createMovieSchema = z.object({
  title: z
    .string()
    .min(1, 'Judul tidak boleh kosong')
    .max(255, 'Judul maksimal 255 karakter'),
  genre: z
    .string()
    .min(1, 'Genre tidak boleh kosong')
    .max(255, 'Genre maksimal 255 karakter'),
  releaseYear: z
    .int('Tahun rilis harus bilangan bulat')
    .min(1888, 'Tahun rilis minimal 1888')
    .max(new Date().getFullYear(), 'Tahun rilis tidak boleh di masa depan'),
});

export const updateMovieSchema = createMovieSchema.partial();

export const movieIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID harus berupa angka'),
});
