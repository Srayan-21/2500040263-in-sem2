import React from 'react';

export default function Header({ selectedGenre, onSelectGenre, genres, onOpenAdd }) {
  return (
    <header className="site-header">
      <div className="header-top">
        <a href="/" className="logo">
          🎬 Movie Club
        </a>
        <ul className="nav-links">
          {genres.map((genre) => (
            <li key={genre}>
              <button
                className={`nav-btn ${selectedGenre === genre ? 'active' : ''}`}
                onClick={() => onSelectGenre(genre)}
              >
                {genre}
              </button>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge-connected">● MongoDB Atlas</span>
          <button className="btn-primary" onClick={onOpenAdd}>+ Add Movie</button>
        </div>
      </div>
    </header>
  );
}
