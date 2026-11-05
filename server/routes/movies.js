import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Movie from '../models/Movie.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.resolve(__dirname, '../../movies.json');

const router = Router();

// Helper to keep movies.json updated
async function syncToJson() {
  try {
    const list = await Movie.find({}, { _id: 0, title: 1, genre: 1, year: 1, director: 1, rating: 1 });
    fs.writeFileSync(jsonPath, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to sync movies.json:', err.message);
  }
}

// GET /api/movies - List all movies
router.get('/', async (_req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/movies/:id - Get movie by id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/movies - Create new movie
router.post('/', async (req, res) => {
  try {
    const { title, genre, year, director, rating } = req.body;
    if (!title || !genre || !year || !director) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const movie = await Movie.create({
      title,
      genre,
      year: Number(year),
      director,
      rating: Number(rating) || 0,
    });

    await syncToJson();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/movies/:id - Delete movie
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Movie not found' });
    await syncToJson();
    res.json({ message: 'Movie deleted', movie: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/movies/seed - Seed/reload from movies.json
router.post('/seed', async (_req, res) => {
  try {
    if (!fs.existsSync(jsonPath)) {
      return res.status(404).json({ error: 'movies.json not found' });
    }
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    await Movie.deleteMany({});
    await Movie.insertMany(data);
    res.json({ message: `Seeded ${data.length} movies from movies.json` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
