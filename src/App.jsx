import React, { useState } from 'react';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import './App.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('portal-theme') || 'glass');

  return (
    <div className="app-container">
      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <ThemeSwitcher currentTheme={theme} onChangeTheme={setTheme} />
      </div>
      
      <main className="main-content card" style={{ margin: '1rem' }}>
        <h1>Portal Club Náutico</h1>
        <p>Selecciona un tema para ver los cambios de estilos en vivo.</p>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Botón de Prueba
        </button>
      </main>
    </div>
  );
}

export default App;
