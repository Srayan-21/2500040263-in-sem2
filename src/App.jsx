import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Sci-Fi',
    year: new Date().getFullYear(),
    director: '',
    rating: 8.0,
  });

  const fetchMovies = async () => {
    try {
      const res = await fetch('/api/movies');
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      }
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const genres = ['All', ...Array.from(new Set(movies.map((m) => m.genre).filter(Boolean)))];

  const filteredMovies =
    selectedGenre === 'All'
      ? movies
      : movies.filter((m) => m.genre.toLowerCase() === selectedGenre.toLowerCase());

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          title: '',
          genre: 'Sci-Fi',
          year: new Date().getFullYear(),
          director: '',
          rating: 8.0,
        });
        fetchMovies();
      }
    } catch (err) {
      console.error('Error adding movie:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this movie from the club?')) return;
    try {
      const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMovies();
      }
    } catch (err) {
      console.error('Error deleting movie:', err);
    }
  };

  const handleResetSeed = async () => {
    if (!confirm('Reload movies from movies.json into MongoDB?')) return;
    try {
      const res = await fetch('/api/movies/seed', { method: 'POST' });
      if (res.ok) {
        fetchMovies();
      }
    } catch (err) {
      console.error('Error resetting seed:', err);
    }
  };

  return (
    <div className="app-layout">
      <Header
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
        genres={genres}
        onOpenAdd={() => setShowModal(true)}
      />

      <section className="hero-section">
        <p className="hero-tag">Official Club Collection</p>
        <h1 className="hero-heading">Curated Cinema for Film Lovers</h1>
        <p className="hero-subtext">
          Browse, add, and explore discussions with a live MongoDB backend and JSON sync.
        </p>
      </section>

      <main className="main-container">
        <div className="section-header">
          <h2 className="section-title">
            {selectedGenre === 'All' ? 'All Movies' : `${selectedGenre} Movies`} ({filteredMovies.length})
          </h2>
          <button className="btn-cancel" onClick={handleResetSeed} title="Reload initial seed JSON">
            🔄 Reset from movies.json
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>Loading movies...</p>
        ) : filteredMovies.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>No movies found in this genre.</p>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <div key={movie._id} className="movie-card">
                <div>
                  <div className="movie-top">
                    <span className="movie-genre">{movie.genre}</span>
                    <span className="movie-rating">⭐ {movie.rating}</span>
                  </div>
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-meta">Directed by {movie.director}</p>
                </div>
                <div className="movie-footer">
                  <span>Year: {movie.year}</span>
                  <button className="btn-delete" onClick={() => handleDelete(movie._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Movie</h3>
              <button
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Movie Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parasite"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drama, Sci-Fi, Thriller"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Release Year</label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Director</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bong Joon-ho"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Rating (0-10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save to MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer movieCount={movies.length} />
    </div>
  );
}
