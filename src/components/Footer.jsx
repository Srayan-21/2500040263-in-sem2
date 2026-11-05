import React from 'react';

export default function Footer({ movieCount }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <h3>Movie Club</h3>
          <p style={{ fontSize: '13px' }}>Backend powered by MongoDB Atlas & Express</p>
        </div>
        <div style={{ fontSize: '13px', color: '#64748b' }}>
          <span>Total Films: {movieCount}</span> • <span>© 2026 Movie Club</span>
        </div>
      </div>
    </footer>
  );
}
