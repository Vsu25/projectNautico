import React, { useEffect } from 'react';
import './ThemeSwitcher.css';

export function ThemeSwitcher({ currentTheme, onChangeTheme }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('portal-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="theme-switcher">
      <button 
        className={currentTheme === 'glass' ? 'active' : ''} 
        onClick={() => onChangeTheme('glass')}
        data-testid="btn-glass"
      >
        Glass
      </button>
      <button 
        className={currentTheme === 'flat' ? 'active' : ''} 
        onClick={() => onChangeTheme('flat')}
        data-testid="btn-flat"
      >
        Flat
      </button>
      <button 
        className={currentTheme === 'brutalist' ? 'active' : ''} 
        onClick={() => onChangeTheme('brutalist')}
        data-testid="btn-brutalist"
      >
        Brutalist
      </button>
    </div>
  );
}
