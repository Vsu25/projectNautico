import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StaffLayout } from './components/StaffLayout';
import { LoginView } from './views/LoginView';
import { SaldosView } from './views/SaldosView';
import { CuentasView } from './views/CuentasView';
import { HistorialView } from './views/HistorialView';
import { InfoView } from './views/InfoView';

// Staff Views
import { VerifyDepositsView } from './views/staff/VerifyDepositsView';
import { MemberDirectoryView } from './views/staff/MemberDirectoryView';
import { BillingAdminView } from './views/staff/BillingAdminView';

// Seed mock members database
const initialMembers = [
  { id: 'V-12.345.678', name: 'JUAN PÉREZ', email: 'socio@club.com', status: 'Active', balance: 1000.00, debt: 345.50 },
  { id: 'V-23.456.789', name: 'MARÍA RODRÍGUEZ', email: 'maria@club.com', status: 'Active', balance: 50.00, debt: 150.00 },
  { id: 'V-34.567.890', name: 'CARLOS GÓMEZ', email: 'carlos@club.com', status: 'Suspended', balance: 0.00, debt: 450.00 },
  { id: 'V-45.678.901', name: 'ANA MARTÍNEZ', email: 'ana@club.com', status: 'Active', balance: 1200.00, debt: 0.00 }
];

// Seed mock deposits queue
const initialDeposits = [
  { id: 'DEP-001', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-23', amount: 150.00, reference: 'REF982347', status: 'Pending', receipt: 'receipt_mock.png' },
  { id: 'DEP-002', memberId: 'V-23.456.789', name: 'MARÍA RODRÍGUEZ', date: '2026-05-22', amount: 100.00, reference: 'REF109283', status: 'Pending', receipt: 'receipt_mock.png' },
  { id: 'DEP-003', memberId: 'V-34.567.890', name: 'CARLOS GÓMEZ', date: '2026-05-20', amount: 450.00, reference: 'REF554312', status: 'Pending', receipt: 'receipt_mock.png' }
];

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('portal-theme') || 'glass');
  const [mode, setMode] = useState(localStorage.getItem('portal-mode') || 'dark');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('portal-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentTab, setCurrentTab] = useState('saldos');
  const [staffTab, setStaffTab] = useState('verify');

  // Shared application state
  const [members, setMembers] = useState(initialMembers);
  const [deposits, setDeposits] = useState(initialDeposits);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('portal-mode', mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portal-theme', theme);
  }, [theme]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('portal-user', JSON.stringify(user));
    if (user.role === 'staff') {
      setStaffTab('verify');
    } else {
      setCurrentTab('saldos');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('portal-user');
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Render Member View
  if (currentUser.role === 'member') {
    const renderMemberView = () => {
      switch (currentTab) {
        case 'saldos': return <SaldosView />;
        case 'cuentas': return <CuentasView />;
        case 'historial': return <HistorialView />;
        case 'info': return <InfoView />;
        default: return <SaldosView />;
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
        onLogout={handleLogout}
      >
        {renderMemberView()}
      </Layout>
    );
  }

  // Render Staff View
  const renderStaffView = () => {
    switch (staffTab) {
      case 'verify':
        return (
          <VerifyDepositsView 
            deposits={deposits} 
            setDeposits={setDeposits} 
            members={members} 
            setMembers={setMembers} 
          />
        );
      case 'directory':
        return (
          <MemberDirectoryView 
            members={members} 
            setMembers={setMembers} 
          />
        );
      case 'billing':
        return (
          <BillingAdminView 
            members={members} 
            setMembers={setMembers} 
            deposits={deposits}
          />
        );
      default:
        return <VerifyDepositsView deposits={deposits} setDeposits={setDeposits} members={members} setMembers={setMembers} />;
    }
  };

  return (
    <StaffLayout
      currentTab={staffTab}
      onChangeTab={setStaffTab}
      theme={theme}
      onChangeTheme={setTheme}
      mode={mode}
      onChangeMode={setMode}
      onLogout={handleLogout}
    >
      {renderStaffView()}
    </StaffLayout>
  );
}

export default App;
