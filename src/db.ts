import { Pool } from "pg";

export const pool = new Pool({
  user: 'post',
  host: 'localhost',
  database: 'movie-express',
  password: '12345678',
  port: 5432,
});