import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SaldosView } from './views/SaldosView';
import { CuentasView } from './views/CuentasView';
import { HistorialView } from './views/HistorialView';
// Import the new InfoView once it's created, fallback to Saldos for now to prevent crash
// import { InfoView } from './views/InfoView';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('portal-theme') || 'glass');
  const [mode, setMode] = useState(localStorage.getItem('portal-mode') || 'dark');
  const [currentTab, setCurrentTab] = useState('saldos');

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('portal-mode', mode);
  }, [mode]);

  const renderView = () => {
    switch (currentTab) {
      case 'saldos':
        return <SaldosView />;
      case 'cuentas':
        return <CuentasView />;
      case 'historial':
        return <HistorialView />;
      case 'info':
        // Return null temporarily until InfoView is created in Task 3
        return null;
      default:
        return <SaldosView />;
    }
  };

  return (
    <Layout 
      currentTab={currentTab} 
      onChangeTab={setCurrentTab}
      theme={theme}
      onChangeTheme={setTheme}
      mode={mode}
      onChangeMode={setMode}
    >
      {renderView()}
    </Layout>
  );
}

export default App;
