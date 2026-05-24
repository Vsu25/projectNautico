import React, { useState } from 'react';
import './StaffLayout.css';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ModeToggle } from './ModeToggle';

export function StaffLayout({ children, currentTab, onChangeTab, theme, onChangeTheme, mode, onChangeMode, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tabs = [
    { id: 'verify', label: 'Verificar Pagos', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    )},
    { id: 'payments', label: 'Transacciones', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    )},
    { id: 'directory', label: 'Directorio Socios', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )},
    { id: 'billing', label: 'Facturación', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )}
  ];

  return (
    <div className="staff-layout">
      <nav className="staff-navbar">
        <div className="nav-brand">
          <div className="logo-badge">CNM</div>
          <div>
            <h1>Club Náutico</h1>
            <span className="staff-role-badge">Panel Administrativo</span>
          </div>
        </div>

        {/* Hamburger icon */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`nav-link-btn ${currentTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  onChangeTab(tab.id);
                  setMenuOpen(false);
                }}
              >
                <span className="icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="nav-actions">
            <ModeToggle mode={mode} onToggle={onChangeMode} />
            <ThemeSwitcher currentTheme={theme} onChangeTheme={onChangeTheme} />
            <button className="btn-logout" onClick={onLogout} aria-label="Salir">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg> <span>Salir</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="staff-main-container">
        {children}
      </main>
    </div>
  );
}
