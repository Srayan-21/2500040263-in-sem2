# Movie Club API

Minimal backend with MongoDB and JSON storage for Movie Club.

## Project Structure

```
movieclub/
├── server/
│   ├── models/
│   │   └── Movie.js
│   ├── routes/
│   │   └── movies.js
│   └── index.js
├── movies.json
├── .env
├── .env.example
├── .gitignore
└── package.json
```

## Running the Server

```powershell
npm run server
```

The server connects to MongoDB and seeds initial data from `movies.json` if empty.

## API Endpoints

- `GET /api/movies` - List all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Add movie (saves to MongoDB & syncs to `movies.json`)
- `DELETE /api/movies/:id` - Delete movie (removes from MongoDB & syncs to `movies.json`)
- `POST /api/movies/seed` - Reload/reset movies from `movies.json`
