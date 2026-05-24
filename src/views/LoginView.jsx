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

  return (
    <div className="login-container view-content-active">
      <div className="card login-card">
        <h2>Portal Club Náutico</h2>
        <p className="subtitle">Ingrese sus credenciales de acceso</p>
        <form onSubmit={handleSubmit}>
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
          <p><strong>Credenciales de Prueba:</strong></p>
          <ul>
            <li>Socio: <code>socio@club.com</code></li>
            <li>Staff: <code>staff@club.com</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
