import React, { useState } from 'react';
import './StaffLayout.css';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ModeToggle } from './ModeToggle';

export function StaffLayout({ children, currentTab, onChangeTab, theme, onChangeTheme, mode, onChangeMode, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tabs = [
    { id: 'verify', label: 'Verificar Pagos', icon: '🔍' },
    { id: 'directory', label: 'Directorio Socios', icon: '👥' },
    { id: 'billing', label: 'Cobros & Facturación', icon: '⚙️' }
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
          ☰
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
              🚪 <span>Salir</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="staff-main-container view-content-active">
        {children}
      </main>
    </div>
  );
}
