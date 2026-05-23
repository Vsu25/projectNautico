import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { SaldosView } from './views/SaldosView';
import { CuentasView } from './views/CuentasView';
import { HistorialView } from './views/HistorialView';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('portal-theme') || 'glass');
  const [currentTab, setCurrentTab] = useState('saldos');

  const renderView = () => {
    switch (currentTab) {
      case 'saldos':
        return <SaldosView />;
      case 'cuentas':
        return <CuentasView />;
      case 'historial':
        return <HistorialView />;
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
    >
      {renderView()}
    </Layout>
  );
}

export default App;
