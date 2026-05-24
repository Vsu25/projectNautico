import React, { useState } from 'react';
import './LoginView.css';

export function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    const role = email.toLowerCase().includes('staff') || email.toLowerCase().includes('admin') ? 'staff' : 'member';
    onLogin({ email, role });
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo1234');
    const role = demoEmail.toLowerCase().includes('staff') || demoEmail.toLowerCase().includes('admin') ? 'staff' : 'member';
    onLogin({ email: demoEmail, role });
  };

  return (
    <div className="login-container view-content-active">
      <div className="card login-card">
        <h2>Portal Club Náutico</h2>
        
        {/* sailboat SVG Logo in center */}
        <div className="login-logo-container">
          <svg className="login-logo" viewBox="0 0 100 100" width="80" height="80">
            {/* Main Sail */}
            <path d="M50 15 L78 63 L50 63 Z" fill="var(--color-accent)" />
            {/* Jib Sail */}
            <path d="M46 22 L22 63 L46 63 Z" fill="var(--color-text-primary)" opacity="0.6" />
            {/* Mast */}
            <rect x="47" y="10" width="3" height="55" fill="var(--color-text-primary)" />
            {/* Hull */}
            <path d="M18 70 L82 70 L72 82 L28 82 Z" fill="var(--color-accent)" />
            {/* Waves */}
            <path d="M10 88 Q 30 85, 50 88 T 90 88" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <p className="subtitle">Ingrese sus credenciales de acceso</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Correo electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn">Iniciar Sesión</button>
        </form>

        <div className="credentials-helper">
          <p className="helper-title">Acceso Rápido de Prueba:</p>
          <div className="demo-buttons">
            <button 
              type="button" 
              className="btn btn-demo" 
              onClick={() => handleQuickLogin('socio@club.com')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.35rem'}}>
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              Socio Demo
            </button>
            <button 
              type="button" 
              className="btn btn-demo" 
              onClick={() => handleQuickLogin('staff@club.com')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.35rem'}}>
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              Staff Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
