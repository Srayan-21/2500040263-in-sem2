import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Movie from './models/Movie.js';
import moviesRouter from './routes/movies.js';

// Ensure SRV records resolve smoothly on Windows / local networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (_) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.resolve(__dirname, '../movies.json');

const port = Number(process.env.PORT ?? 5000);
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movieclub';

const app = express();
app.disable('x-powered-by');
app.use(express.json());

// Routes
app.use('/api/movies', moviesRouter);

app.get('/api', (_req, res) => {
  res.json({ message: 'Movie Club API is running' });
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

// Auto-seed from movies.json if MongoDB collection is empty
async function seedInitialData() {
  try {
    const count = await Movie.countDocuments();
    if (count === 0 && fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        await Movie.insertMany(data);
        console.log(`Seeded ${data.length} movies from movies.json`);
      }
    }
  } catch (err) {
    console.error('Initial seed error:', err.message);
  }
}

// Connect to MongoDB & Start Server
try {
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
  await seedInitialData();

  app.listen(port, () => {
    console.log(`Movie Club server listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error(`MongoDB connection failed: ${error.message}`);
  process.exit(1);
}
