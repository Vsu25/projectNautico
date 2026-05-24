import React from 'react';
import './Layout.css';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ModeToggle } from './ModeToggle';

export function Layout({ children, currentTab, onChangeTab, theme, onChangeTheme, mode, onChangeMode, onLogout }) {
  const tabs = [
    { id: 'saldos', label: 'Saldos', icon: '💳' },
    { id: 'cuentas', label: 'Cuentas', icon: '🧾' },
    { id: 'historial', label: 'Historial', icon: '🕒' },
    { id: 'info', label: 'Guía', icon: 'ℹ️' }
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
              <span className="icon">🚪</span>
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
               🚪
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
