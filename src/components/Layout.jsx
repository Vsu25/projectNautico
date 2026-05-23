import React from 'react';
import './Layout.css';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Layout({ children, currentTab, onChangeTab, theme, onChangeTheme }) {
  const tabs = [
    { id: 'saldos', label: 'Saldos', icon: '💳' },
    { id: 'cuentas', label: 'Cuentas', icon: '🧾' },
    { id: 'historial', label: 'Historial', icon: '🕒' }
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
          <ThemeSwitcher currentTheme={theme} onChangeTheme={onChangeTheme} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="mobile-header">
          <div className="logo-placeholder">CNM</div>
          <span className="bcv-rate">BCV: 92.45 VES</span>
          <div className="mobile-theme-switcher">
             <ThemeSwitcher currentTheme={theme} onChangeTheme={onChangeTheme} />
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
