import React from 'react';
import './Layout.css';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ModeToggle } from './ModeToggle';

export function Layout({ children, currentTab, onChangeTab, theme, onChangeTheme, mode, onChangeMode, onLogout }) {
  const tabs = [
    { id: 'saldos', label: 'Saldos', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    )},
    { id: 'cuentas', label: 'Cuentas', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    )},
    { id: 'historial', label: 'Historial', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )},
    { id: 'info', label: 'Guía', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    )}
  ];

  return (
    <div className="layout-container">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-placeholder">CNM</div>
          <h2>Club Náutico</h2>
          <p className="user-name">Socio V-12345678</p>
        </div>
        
        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`nav-btn ${currentTab === tab.id ? 'active' : ''}`}
              onClick={() => onChangeTab(tab.id)}
            >
              <span className="icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ModeToggle mode={mode} onToggle={onChangeMode} />
            <ThemeSwitcher currentTheme={theme} onChangeTheme={onChangeTheme} />
            <button className="nav-btn logout-btn" onClick={onLogout} style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              <span className="icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg></span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="mobile-header">
          <div className="logo-placeholder">CNM</div>
          <span className="bcv-rate">BCV: 92.45 VES</span>
          <div className="mobile-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
             <ModeToggle mode={mode} onToggle={onChangeMode} />
             <div className="mobile-theme-switcher">
               <ThemeSwitcher currentTheme={theme} onChangeTheme={onChangeTheme} />
             </div>
             <button className="mobile-logout-btn" onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem' }} title="Cerrar Sesión">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                 <polyline points="16 17 21 12 16 7" />
                 <line x1="21" y1="12" x2="9" y2="12" />
               </svg>
             </button>
          </div>
        </header>
        
        <div className="content-area">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`nav-btn ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => onChangeTab(tab.id)}
          >
            <span className="icon">{tab.icon}</span>
            <span className="label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
