import React from 'react';
import './ModeToggle.css';

export function ModeToggle({ mode, onToggle }) {
  const isDark = mode === 'dark';
  
  return (
    <button 
      className={`mode-toggle ${isDark ? 'is-dark' : 'is-light'}`} 
      onClick={() => onToggle(isDark ? 'light' : 'dark')}
      aria-label="Toggle Dark Mode"
    >
      <span className="mode-icon">{isDark ? '🌙' : '☀️'}</span>
    </button>
  );
}
