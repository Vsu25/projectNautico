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
import { PaymentsHistoryView } from './views/staff/PaymentsHistoryView';
import { MemberDirectoryView } from './views/staff/MemberDirectoryView';
import { BillingAdminView } from './views/staff/BillingAdminView';

// Seed mock members database (users + credit_accounts tables)
const initialMembers = [
  { id: 'V-12.345.678', name: 'JUAN PÉREZ', email: 'socio@club.com', status: 'Active', balance: 1000.00, debt: 345.50, accountNumber: '01187' },
  { id: 'V-99.888.777', name: 'VICTOR PÉREZ', email: 'victor@club.com', status: 'Active', balance: 1000.00, debt: 345.50, accountNumber: '01187' },
  { id: 'V-23.456.789', name: 'MARÍA RODRÍGUEZ', email: 'maria@club.com', status: 'Active', balance: 50.00, debt: 150.00, accountNumber: '01188' },
  { id: 'V-34.567.890', name: 'CARLOS GÓMEZ', email: 'carlos@club.com', status: 'Suspended', balance: 0.00, debt: 450.00, accountNumber: '01189' },
  { id: 'V-45.678.901', name: 'ANA MARTÍNEZ', email: 'ana@club.com', status: 'Active', balance: 1200.00, debt: 0.00, accountNumber: '01190' }
];

// Seed mock purchases database (purchases_orders table injected from External Club System)
const initialPurchases = [
  // ── Paid history (socio V-12.345.678) ────────────────────────────
  { 
    id: 'INV-101', 
    user_id: 'V-12.345.678', 
    amount_usd: 150.00, 
    description: 'Consumo Rest. La Marina', 
    status: 'paid_with_transfer', 
    created_at: '2026-05-23',
    items: [
      { name: 'Parrilla Mar y Tierra', qty: 2, price: 60.00 },
      { name: 'Cóctel del Caribe', qty: 4, price: 7.50 }
    ]
  },
  { 
    id: 'INV-102', 
    user_id: 'V-12.345.678', 
    amount_usd: 95.50, 
    description: 'Alquiler Cancha Tenis', 
    status: 'paid_with_transfer', 
    created_at: '2026-05-22',
    items: [
      { name: 'Uso Cancha Arcilla (2h)', qty: 1, price: 50.00 },
      { name: 'Pelotas Tenis Pro', qty: 3, price: 8.50 },
      { name: 'Alquiler Raquetas', qty: 2, price: 10.00 }
    ]
  },
  { 
    id: 'INV-109', 
    user_id: 'V-12.345.678', 
    amount_usd: 60.00, 
    description: 'Consumo Bar Piscina', 
    status: 'paid_with_credit', 
    created_at: '2026-05-10',
    items: [
      { name: 'Combo Familiar Piscina', qty: 1, price: 35.00 },
      { name: 'Cervezas Artesanales', qty: 5, price: 5.00 }
    ]
  },
  { 
    id: 'INV-110', 
    user_id: 'V-12.345.678', 
    amount_usd: 200.00, 
    description: 'Mensualidad Club Abril', 
    status: 'paid_with_transfer', 
    created_at: '2026-04-01',
    items: [
      { name: 'Cuota de Membresía Abril 2026', qty: 1, price: 80.00 },
      { name: 'Contribución Fondo Deportes', qty: 1, price: 20.00 },
      { name: 'Cuota Extraordinaria Aniversario', qty: 1, price: 100.00 }
    ]
  },
  { 
    id: 'INV-111', 
    user_id: 'V-12.345.678', 
    amount_usd: 45.00, 
    description: 'Clase de Vela Introductoria', 
    status: 'paid_with_credit', 
    created_at: '2026-04-15',
    items: [
      { name: 'Clase Grupal Optimist (2h)', qty: 1, price: 30.00 },
      { name: 'Alquiler Chaleco Salvavidas', qty: 1, price: 15.00 }
    ]
  },
  // ── Pending bills (socio V-12.345.678) ───────────────────────────
  { 
    id: 'INV-103', 
    user_id: 'V-12.345.678', 
    amount_usd: 100.00, 
    description: 'Mensualidad Club Mayo', 
    status: 'pending', 
    created_at: '2026-05-01',
    items: [
      { name: 'Cuota de Membresía Mayo 2026', qty: 1, price: 80.00 },
      { name: 'Contribución Fondo Deportes', qty: 1, price: 20.00 }
    ]
  },
  { 
    id: 'INV-106', 
    user_id: 'V-12.345.678', 
    amount_usd: 75.00, 
    description: 'Consumo Rest. La Marina', 
    status: 'pending', 
    created_at: '2026-05-24',
    items: [
      { name: 'Parrilla de Carne Especial', qty: 1, price: 50.00 },
      { name: 'Bebidas Premium', qty: 2, price: 12.50 }
    ]
  },
  { 
    id: 'INV-107', 
    user_id: 'V-12.345.678', 
    amount_usd: 120.00, 
    description: 'Mantenimiento Embarcación', 
    status: 'pending', 
    created_at: '2026-05-20',
    items: [
      { name: 'Servicio Mecánico Express', qty: 1, price: 120.00 }
    ]
  },
  { 
    id: 'INV-108', 
    user_id: 'V-12.345.678', 
    amount_usd: 35.00, 
    description: 'Invitaciones Piscina Especial', 
    status: 'pending', 
    created_at: '2026-05-18',
    items: [
      { name: 'Pase de Invitado', qty: 7, price: 5.00 }
    ]
  },
  { 
    id: 'INV-112', 
    user_id: 'V-12.345.678', 
    amount_usd: 55.00, 
    description: 'Gimnasio y Área Fitness', 
    status: 'pending', 
    created_at: '2026-05-22',
    items: [
      { name: 'Mensualidad Gimnasio Mayo', qty: 1, price: 40.00 },
      { name: 'Sesión Personal Trainer', qty: 1, price: 15.00 }
    ]
  },
  { 
    id: 'INV-113', 
    user_id: 'V-12.345.678', 
    amount_usd: 90.00, 
    description: 'Escuela de Navegación', 
    status: 'pending', 
    created_at: '2026-05-19',
    items: [
      { name: 'Curso Navegación Costera (4h)', qty: 1, price: 70.00 },
      { name: 'Material Didáctico Náutico', qty: 1, price: 20.00 }
    ]
  },
  { 
    id: 'INV-114', 
    user_id: 'V-12.345.678', 
    amount_usd: 180.00, 
    description: 'Evento Social Noche de Gala', 
    status: 'pending', 
    created_at: '2026-05-17',
    items: [
      { name: 'Entrada Gala Aniversario (x2)', qty: 2, price: 60.00 },
      { name: 'Mesa VIP con Decoración', qty: 1, price: 40.00 },
      { name: 'Botella Vino Reserva Especial', qty: 1, price: 20.00 }
    ]
  },
  // ── Other members' purchases ─────────────────────────────────────
  { 
    id: 'INV-104', 
    user_id: 'V-23.456.789', 
    amount_usd: 150.00, 
    description: 'Consumo Bar Piscina', 
    status: 'pending', 
    created_at: '2026-05-22',
    items: [
      { name: 'Hamburguesa Club', qty: 3, price: 25.00 },
      { name: 'Tobos de Cerveza Nacional', qty: 2, price: 30.00 },
      { name: 'Helados Copa Marina', qty: 3, price: 5.00 }
    ]
  },
  { 
    id: 'INV-105', 
    user_id: 'V-34.567.890', 
    user_name: 'CARLOS GÓMEZ', 
    amount_usd: 450.00, 
    description: 'Cuota Mantenimiento Muelle', 
    status: 'pending', 
    created_at: '2026-05-15',
    items: [
      { name: 'Mantenimiento Muelle Principal', qty: 1, price: 400.00 },
      { name: 'Servicio de Boyas', qty: 1, price: 50.00 }
    ]
  }
];

// Seed mock deposits queue (payment_tickets table)
const initialDeposits = [
  // ── Pending verification ─────────────────────────────────────────
  { id: 'DEP-001', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-23', amount: 150.00, reference: 'REF982347', status: 'Pending', receipt: 'receipt_mock.png', invoiceId: 'INV-103' },
  { id: 'DEP-002', memberId: 'V-23.456.789', name: 'MARÍA RODRÍGUEZ', date: '2026-05-22', amount: 100.00, reference: 'REF109283', status: 'Pending', receipt: 'receipt_mock.png', invoiceId: 'INV-104' },
  { id: 'DEP-003', memberId: 'V-34.567.890', name: 'CARLOS GÓMEZ', date: '2026-05-20', amount: 450.00, reference: 'REF554312', status: 'Pending', receipt: 'receipt_mock.png', invoiceId: 'INV-105' },
  { id: 'DEP-007', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-24', amount: 75.00, reference: 'REF443210', status: 'Pending', receipt: 'receipt_mock.png', invoiceId: 'INV-106' },
  { id: 'DEP-011', memberId: 'V-99.888.777', name: 'VICTOR PÉREZ', date: '2026-05-24', amount: 100.00, reference: 'PAGOMOVIL4433', status: 'Pending', receipt: 'receipt_mock.png', invoiceId: 'INV-103' },
  // ── Approved ─────────────────────────────────────────────────────
  { id: 'DEP-004', memberId: 'V-45.678.901', name: 'ANA MARTÍNEZ', date: '2026-05-18', amount: 300.00, reference: 'REF111222', status: 'auto_approved', receipt: 'receipt_mock.png' },
  { id: 'DEP-005', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-15', amount: 95.50, reference: 'REF887766', status: 'manually_approved', receipt: 'receipt_mock.png', invoiceId: 'INV-102' },
  { id: 'DEP-008', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-04-02', amount: 200.00, reference: 'REF776655', status: 'auto_approved', receipt: 'receipt_mock.png', invoiceId: 'INV-110' },
  { id: 'DEP-009', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-23', amount: 150.00, reference: 'REF334455', status: 'manually_approved', receipt: 'receipt_mock.png', invoiceId: 'INV-101' },
  // ── Rejected ─────────────────────────────────────────────────────
  { id: 'DEP-006', memberId: 'V-23.456.789', name: 'MARÍA RODRÍGUEZ', date: '2026-05-10', amount: 50.00, reference: 'REF999000', status: 'rejected', rejectionReason: 'Comprobante borroso', receipt: 'receipt_mock.png' },
  { id: 'DEP-010', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-12', amount: 35.00, reference: 'REF221100', status: 'rejected', rejectionReason: 'Monto no coincide con la factura', receipt: 'receipt_mock.png', invoiceId: 'INV-108' }
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

  // Shared application state tables
  const [members, setMembers] = useState(initialMembers);
  const [deposits, setDeposits] = useState(initialDeposits);
  const [purchases, setPurchases] = useState(initialPurchases);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('portal-mode', mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portal-theme', theme);
  }, [theme]);

  const handleLogin = (user) => {
    // Enrich the logged in user with data from the mock database (specifically their ID)
    const matchedMember = members.find(m => m.email === user.email);
    const enrichedUser = matchedMember ? { ...user, ...matchedMember } : { ...user, id: 'V-12.345.678', name: 'Socio Demo' };

    setCurrentUser(enrichedUser);
    localStorage.setItem('portal-user', JSON.stringify(enrichedUser));
    if (enrichedUser.role === 'staff') {
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
        case 'saldos': 
          return (
            <SaldosView 
              currentUser={currentUser} 
              members={members} 
            />
          );
        case 'cuentas': 
          return (
            <CuentasView 
              purchases={purchases} 
              setPurchases={setPurchases} 
              members={members} 
              setMembers={setMembers} 
              deposits={deposits} 
              setDeposits={setDeposits} 
              currentUser={currentUser} 
            />
          );
        case 'historial': 
          return (
            <HistorialView 
              currentUser={currentUser} 
              members={members} 
              deposits={deposits} 
            />
          );
        case 'info': return <InfoView />;
        default: return <SaldosView currentUser={currentUser} members={members} />;
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
        currentUser={currentUser}
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
            purchases={purchases}
          />
        );
      case 'payments':
        return (
          <PaymentsHistoryView 
            deposits={deposits} 
            purchases={purchases}
            members={members}
          />
        );
      case 'directory':
        return (
          <MemberDirectoryView 
            members={members} 
            setMembers={setMembers} 
            purchases={purchases}
            deposits={deposits}
          />
        );
      case 'billing':
        return (
          <BillingAdminView 
            members={members} 
            purchases={purchases}
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
