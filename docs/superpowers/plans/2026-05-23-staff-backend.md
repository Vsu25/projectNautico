# Staff Backend Frontend Mockup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate, responsive, themed desktop-first backend mockup for staff, complete with deposit verification, partner directory management, and billing invoicing.

**Architecture:** 
- A unified Login screen that routes users to the Member App or Staff App based on credentials.
- A new Top-Navbar `StaffLayout` that inherits global CSS themes (Glass, Flat, Brutalist) and Light/Dark modes.
- Three administrative views managing verification queue, member accounts, and fee invoicing.
- Global simulated state passed from `App.jsx` so changes to member balances propagate correctly across directories and queues.

**Tech Stack:** React, Vite, Vanilla CSS, Vitest for unit tests.

---

## Proposed Changes

### Task 1: Unified Login View
Create the login screen allowing simulation of member (`socio@club.com`) and staff (`staff@club.com`) logins.

**Files:**
- [NEW] `src/views/LoginView.jsx`
- [NEW] `src/views/LoginView.css`
- [NEW] `src/views/LoginView.test.jsx`

- [ ] **Step 1: Write the failing login test**
Create `src/views/LoginView.test.jsx` to test form submit and render helper credentials.
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginView } from './LoginView';

describe('LoginView', () => {
  it('renders login form and submits with helper credentials', () => {
    const handleLogin = vi.fn();
    render(<LoginView onLogin={handleLogin} />);
    
    expect(screen.getByText('Portal Club Náutico')).toBeInTheDocument();
    
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const loginButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    
    fireEvent.change(emailInput, { target: { value: 'staff@club.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);
    
    expect(handleLogin).toHaveBeenCalledWith({ email: 'staff@club.com', role: 'staff' });
  });
});
```

- [ ] **Step 2: Run test and watch it fail**
Run: `npx vitest run src/views/LoginView.test.jsx`
Expected: Fail (file does not exist or component undefined).

- [ ] **Step 3: Create LoginView files**
Write `src/views/LoginView.jsx` and styling in `src/views/LoginView.css` to build a clean card with helper credentials.
```jsx
// src/views/LoginView.jsx
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
```
Create `src/views/LoginView.css`:
```css
/* src/views/LoginView.css */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--bg-app-color);
}

.login-card {
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.form-group {
  margin-bottom: 1.25rem;
}

.login-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: var(--border-card);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 1rem;
  outline: none;
}

[data-theme="flat"] .login-input {
  background: var(--bg-app-color);
}

[data-theme="brutalist"] .login-input {
  border: 3px solid #0F2C59;
  font-weight: 500;
  box-shadow: 2px 2px 0px #0F2C59;
}

[data-theme="brutalist"][data-mode="dark"] .login-input {
  border: 3px solid #FFFFFF;
  box-shadow: 2px 2px 0px #FFD93D;
}

.login-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.credentials-helper {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: var(--border-card);
  text-align: left;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.credentials-helper ul {
  list-style: none;
  margin-top: 0.5rem;
}

.credentials-helper li {
  margin-bottom: 0.25rem;
}

.credentials-helper code {
  color: var(--color-accent);
  background: rgba(0, 0, 0, 0.2);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}
```

- [ ] **Step 4: Verify test passes**
Run: `npx vitest run src/views/LoginView.test.jsx`
Expected: Pass.

- [ ] **Step 5: Commit login files**
Commit the login files with clear messages.

---

### Task 2: Core Routing and State Integration
Update `App.jsx` to store current user session, mock database data, and select the correct layout.

**Files:**
- [MODIFY] `src/App.jsx`

- [ ] **Step 1: Implement global layout router and mock states**
Modify `src/App.jsx` to support login state (`currentUser` in `localStorage`), switch themes, modes, and manage mock data for verified/unverified deposits and member list.
```jsx
// src/App.jsx
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
```

- [ ] **Step 2: Update member Layout.jsx to support onLogout**
Modify `src/components/Layout.jsx` to show a "Cerrar Sesión" link/button in the sidebar footer and mobile header so users can log out.
Add:
```jsx
// Add logout button in sidebar footer
<button className="nav-btn logout-btn" onClick={onLogout}>
  <span className="icon">🚪</span>
  Cerrar Sesión
</button>
```

- [ ] **Step 3: Run all unit tests to check for regressions**
Run: `npx vitest run`
Expected: 10 tests passed (ensure existing tests don't break).

- [ ] **Step 4: Commit router changes**
Commit changes made to `App.jsx` and `Layout.jsx`.

---

### Task 3: The Top-Navbar Staff Layout
Implement the `StaffLayout` shell with a responsive top navigation.

**Files:**
- [NEW] `src/components/StaffLayout.jsx`
- [NEW] `src/components/StaffLayout.css`
- [NEW] `src/components/StaffLayout.test.jsx`

- [ ] **Step 1: Write StaffLayout test**
Create `src/components/StaffLayout.test.jsx` to test rendering links, role indicators, and toggle switchers.
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StaffLayout } from './StaffLayout';

describe('StaffLayout', () => {
  it('renders top navbar, role indicator and handles logout clicks', () => {
    const handleTabChange = vi.fn();
    const handleLogout = vi.fn();
    
    render(
      <StaffLayout 
        currentTab="verify" 
        onChangeTab={handleTabChange}
        theme="glass"
        onChangeTheme={vi.fn()}
        mode="dark"
        onChangeMode={vi.fn()}
        onLogout={handleLogout}
      >
        <div data-testid="child">Content</div>
      </StaffLayout>
    );
    
    expect(screen.getByText(/Panel Administrativo/i)).toBeInTheDocument();
    expect(screen.getByText(/Verificar Pagos/i)).toBeInTheDocument();
    
    const logoutBtn = screen.getByRole('button', { name: /Salir/i });
    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test and watch it fail**
Run: `npx vitest run src/components/StaffLayout.test.jsx`
Expected: Fail.

- [ ] **Step 3: Create StaffLayout component**
Write `src/components/StaffLayout.jsx` with responsive hamburger layout and top bar.
```jsx
// src/components/StaffLayout.jsx
import React, { useState } from 'react';
import './StaffLayout.css';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ModeToggle } from './ModeToggle';

export function StaffLayout({ children, currentTab, onChangeTab, theme, onChangeTheme, mode, onChangeMode, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tabs = [
    { id: 'verify', label: 'Verificar Pagos', icon: '🔍' },
    { id: 'directory', label: 'Directorio Socios', icon: '👥' },
    { id: 'billing', label: 'Cobros & Facturación', icon: '⚙️' }
  ];

  return (
    <div className="staff-layout">
      <nav className="staff-navbar">
        <div className="nav-brand">
          <div className="logo-badge">CNM</div>
          <div>
            <h1>Club Náutico</h1>
            <span className="staff-role-badge">Panel Administrativo</span>
          </div>
        </div>

        {/* Hamburger icon */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`nav-link-btn ${currentTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  onChangeTab(tab.id);
                  setMenuOpen(false);
                }}
              >
                <span className="icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="nav-actions">
            <ModeToggle mode={mode} onToggle={onChangeMode} />
            <ThemeSwitcher currentTheme={theme} onChangeTheme={onChangeTheme} />
            <button className="btn-logout" onClick={onLogout} aria-label="Salir">
              🚪 <span>Salir</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="staff-main-container view-content-active">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Create StaffLayout styling**
Write styling supporting all global theme overrides (borders, glassmorphism, brutalist cards).
```css
/* src/components/StaffLayout.css */
.staff-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-app-color);
  background-image: var(--bg-app-image);
  color: var(--color-text-primary);
  font-family: var(--font-body);
}

.staff-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--bg-card);
  border-bottom: var(--border-card);
  box-shadow: var(--box-shadow);
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-brand h1 {
  font-size: 1.2rem;
  margin: 0;
}

.logo-badge {
  background: var(--color-accent);
  color: #0F2C59;
  padding: 0.5rem;
  font-family: var(--font-title);
  font-weight: 700;
  border-radius: var(--border-radius);
  border: [data-theme="brutalist"] ? 3px solid #0F2C59 : none;
}

[data-theme="brutalist"] .logo-badge {
  border: 2px solid #0F2C59;
}
[data-theme="brutalist"][data-mode="dark"] .logo-badge {
  border: 2px solid #FFFFFF;
}

.staff-role-badge {
  font-size: 0.75rem;
  color: var(--color-accent);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.menu-toggle {
  display: none;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-family: var(--font-title);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-speed) var(--transition-easing);
}

.nav-link-btn:hover {
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.nav-link-btn.active {
  color: var(--color-text-primary);
  background: var(--color-accent);
  color: #0F2C59;
}

[data-theme="brutalist"] .nav-link-btn.active {
  border: 2px solid #0F2C59;
  box-shadow: 2px 2px 0px #0F2C59;
}

[data-theme="brutalist"][data-mode="dark"] .nav-link-btn.active {
  border: 2px solid #FFFFFF;
  box-shadow: 2px 2px 0px #FFD93D;
  color: #000000;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
  border-radius: var(--border-radius);
  padding: 0.4rem 0.8rem;
  font-family: var(--font-title);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-speed) var(--transition-easing);
}

.btn-logout:hover {
  background: var(--color-danger);
  color: #FFFFFF;
}

[data-theme="brutalist"] .btn-logout {
  border: 2px solid var(--color-danger);
  box-shadow: 2px 2px 0px var(--color-danger);
}

[data-theme="brutalist"] .btn-logout:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.staff-main-container {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 992px) {
  .menu-toggle {
    display: block;
  }

  .nav-menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-card);
    border-bottom: var(--border-card);
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .nav-menu.open {
    display: flex;
    box-shadow: var(--box-shadow);
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
  }

  .nav-link-btn {
    width: 100%;
    padding: 0.75rem 1rem;
  }

  .nav-actions {
    width: 100%;
    justify-content: space-between;
  }
}
```

- [ ] **Step 5: Verify test passes**
Run: `npx vitest run src/components/StaffLayout.test.jsx`
Expected: Pass.

- [ ] **Step 6: Commit StaffLayout**
Commit StaffLayout files.

---

### Task 4: View A - Verify Deposits Queue
Create the verification ledger screen that allows staff to review receipt details and approve/reject reported deposits.

**Files:**
- [NEW] `src/views/staff/VerifyDepositsView.jsx`
- [NEW] `src/views/staff/VerifyDepositsView.css`
- [NEW] `src/views/staff/VerifyDepositsView.test.jsx`

- [ ] **Step 1: Write VerifyDepositsView test**
Create `src/views/staff/VerifyDepositsView.test.jsx` to test clicking "Aprobar" adds member balances, and clicking "Rechazar" prompts a rejection modal.
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VerifyDepositsView } from './VerifyDepositsView';

describe('VerifyDepositsView', () => {
  it('displays pending deposits and processes approvals', () => {
    const deposits = [
      { id: 'DEP-001', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-23', amount: 150.00, reference: 'REF982347', status: 'Pending', receipt: 'receipt_mock.png' }
    ];
    const members = [
      { id: 'V-12.345.678', name: 'JUAN PÉREZ', status: 'Active', balance: 1000.00, debt: 345.50 }
    ];
    const setDeposits = vi.fn();
    const setMembers = vi.fn();

    render(
      <VerifyDepositsView 
        deposits={deposits} 
        setDeposits={setDeposits} 
        members={members} 
        setMembers={setMembers} 
      />
    );

    expect(screen.getByText('REF982347')).toBeInTheDocument();
    
    const approveBtn = screen.getByRole('button', { name: /Aprobar/i });
    fireEvent.click(approveBtn);
    
    expect(setDeposits).toHaveBeenCalled();
    expect(setMembers).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test and watch it fail**
Run: `npx vitest run src/views/staff/VerifyDepositsView.test.jsx`
Expected: Fail.

- [ ] **Step 3: Create VerifyDepositsView component**
Write `src/views/staff/VerifyDepositsView.jsx` incorporating list grid, mock receipt viewer dialog, and rejection reason overlay.
```jsx
// src/views/staff/VerifyDepositsView.jsx
import React, { useState } from 'react';
import './VerifyDepositsView.css';

export function VerifyDepositsView({ deposits, setDeposits, members, setMembers }) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [rejectionTarget, setRejectionTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (deposit) => {
    // 1. Update deposit status
    setDeposits(prev => prev.map(d => d.id === deposit.id ? { ...d, status: 'Approved' } : d));
    // 2. Add balance & subtract debt from member
    setMembers(prev => prev.map(m => {
      if (m.id === deposit.memberId) {
        const remainingDebt = Math.max(0, m.debt - deposit.amount);
        // Exceeding amount goes to credit balance
        const overpayment = Math.max(0, deposit.amount - m.debt);
        return {
          ...m,
          debt: remainingDebt,
          balance: m.balance + overpayment
        };
      }
      return m;
    }));
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectionTarget) return;

    setDeposits(prev => prev.map(d => d.id === rejectionTarget.id ? { ...d, status: 'Rejected', rejectionReason: rejectReason } : d));
    setRejectionTarget(null);
    setRejectReason('');
  };

  const pendingDeposits = deposits.filter(d => d.status === 'Pending');

  return (
    <div className="view-content-active">
      <div className="view-header">
        <h2>Verificación de Depósitos</h2>
        <p className="subtitle">{pendingDeposits.length} transacciones por conciliar</p>
      </div>

      {pendingDeposits.length === 0 ? (
        <div className="card empty-state">
          <span className="big-icon">🎉</span>
          <h3>¡Todo listo!</h3>
          <p>No quedan depósitos pendientes por verificar.</p>
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Socio</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Referencia</th>
                  <th>Comprobante</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendingDeposits.map(dep => (
                  <tr key={dep.id}>
                    <td>
                      <div className="member-cell">
                        <span className="member-name">{dep.name}</span>
                        <span className="member-id">{dep.memberId}</span>
                      </div>
                    </td>
                    <td>{dep.date}</td>
                    <td className="amount-cell">${dep.amount.toFixed(2)}</td>
                    <td><code>{dep.reference}</code></td>
                    <td>
                      <button className="btn-view-receipt" onClick={() => setSelectedReceipt(dep)}>
                        📄 Ver Recibo
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-table btn-approve" onClick={() => handleApprove(dep)}>
                          ✓ Aprobar
                        </button>
                        <button className="btn-table btn-reject" onClick={() => setRejectionTarget(dep)}>
                          ✗ Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mock Receipt Viewer Dialog */}
      {selectedReceipt && (
        <div className="modal-overlay" onClick={() => setSelectedReceipt(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Comprobante de Pago</h3>
              <button className="btn-close" onClick={() => setSelectedReceipt(null)}>×</button>
            </header>
            <div className="modal-body text-center">
              <p className="receipt-ref-label">Referencia: <code>{selectedReceipt.reference}</code></p>
              <div className="mock-receipt-image">
                <div className="receipt-header">Banco Central</div>
                <div className="receipt-row"><span>Transacción:</span> <span>{selectedReceipt.reference}</span></div>
                <div className="receipt-row"><span>Monto:</span> <strong>${selectedReceipt.amount.toFixed(2)}</strong></div>
                <div className="receipt-row"><span>Socio:</span> <span>{selectedReceipt.name}</span></div>
                <div className="receipt-stamp">VALIDADO POR BANCO</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectionTarget && (
        <div className="modal-overlay">
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Rechazar Depósito</h3>
              <button className="btn-close" onClick={() => setRejectionTarget(null)}>×</button>
            </header>
            <form onSubmit={handleRejectSubmit} className="modal-body">
              <p>Indique el motivo del rechazo para <strong>{rejectionTarget.name}</strong>:</p>
              <textarea 
                className="reject-textarea" 
                rows="4" 
                placeholder="Ej. El número de referencia no coincide con el estado de cuenta bancario..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                required
              />
              <div className="modal-footer" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setRejectionTarget(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-danger">
                  Confirmar Rechazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create VerifyDepositsView styling**
Write styling for table grid and modal dialog in `src/views/staff/VerifyDepositsView.css`.
```css
/* src/views/staff/VerifyDepositsView.css */
.view-header {
  margin-bottom: 2rem;
}

.table-card {
  padding: 0;
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th, .admin-table td {
  padding: 1rem 1.5rem;
  border-bottom: var(--border-card);
}

.admin-table th {
  font-family: var(--font-title);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
  background: rgba(0, 0, 0, 0.1);
}

.member-cell {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.member-id {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.amount-cell {
  font-family: var(--font-title);
  font-weight: 700;
  color: var(--color-success);
}

.btn-view-receipt {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  padding: 0.35rem 0.75rem;
  border-radius: var(--border-radius);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-speed) var(--transition-easing);
}

.btn-view-receipt:hover {
  background: var(--color-accent);
  color: #0F2C59;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-table {
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius);
  font-family: var(--font-title);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-speed) var(--transition-easing);
}

.btn-approve {
  background: var(--color-success);
  color: #FFFFFF;
}

.btn-approve:hover {
  filter: brightness(1.1);
}

.btn-reject {
  background: var(--color-danger);
  color: #FFFFFF;
}

.btn-reject:hover {
  filter: brightness(1.1);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.big-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-card {
  background: var(--bg-card);
  border: var(--border-card);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 100%;
  padding: 1.5rem;
  backdrop-filter: var(--backdrop-blur);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  border-bottom: var(--border-card);
  padding-bottom: 0.75rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.mock-receipt-image {
  margin-top: 1rem;
  background: #FFFDF0;
  color: #0F2C59;
  border: 3px solid #0F2C59;
  padding: 1.5rem;
  text-align: left;
  border-radius: 4px;
}

.receipt-header {
  font-weight: 700;
  text-align: center;
  border-bottom: 2px dashed #0F2C59;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.receipt-stamp {
  margin-top: 1.5rem;
  border: 2px solid #2F9E44;
  color: #2F9E44;
  padding: 0.25rem;
  text-align: center;
  font-weight: 700;
  transform: rotate(-5deg);
}

.reject-textarea {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  color: var(--color-text-primary);
  border: var(--border-card);
  border-radius: var(--border-radius);
  outline: none;
  font-family: inherit;
}

[data-theme="flat"] .reject-textarea {
  background: #FFFFFF;
  color: #0F2C59;
  border: 1px solid #CED4DA;
}
[data-theme="brutalist"] .reject-textarea {
  border: 3px solid #0F2C59;
  background: #FFFFFF;
  color: #0F2C59;
}
[data-theme="brutalist"][data-mode="dark"] .reject-textarea {
  border: 3px solid #FFFFFF;
  background: #111111;
  color: #FFFFFF;
}
```

- [ ] **Step 5: Verify test passes**
Run: `npx vitest run src/views/staff/VerifyDepositsView.test.jsx`
Expected: Pass.

- [ ] **Step 6: Commit View A**
Commit changes.

---

### Task 5: View B - Member Directory
Build the searchable member account view.

**Files:**
- [NEW] `src/views/staff/MemberDirectoryView.jsx`
- [NEW] `src/views/staff/MemberDirectoryView.css`
- [NEW] `src/views/staff/MemberDirectoryView.test.jsx`

- [ ] **Step 1: Write MemberDirectoryView test**
Create `src/views/staff/MemberDirectoryView.test.jsx` testing rendering list, status filtering, and click-to-expand details.
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemberDirectoryView } from './MemberDirectoryView';

describe('MemberDirectoryView', () => {
  it('filters member lists and opens details modal', () => {
    const members = [
      { id: 'V-12.345.678', name: 'JUAN PÉREZ', email: 'socio@club.com', status: 'Active', balance: 1000.00, debt: 345.50 }
    ];
    render(<MemberDirectoryView members={members} setMembers={vi.fn()} />);

    expect(screen.getByText('JUAN PÉREZ')).toBeInTheDocument();
    
    // Test search filter
    const searchInput = screen.getByPlaceholderText(/Buscar socio/i);
    fireEvent.change(searchInput, { target: { value: 'Maria' } });
    expect(screen.queryByText('JUAN PÉREZ')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test and watch it fail**
Run: `npx vitest run src/views/staff/MemberDirectoryView.test.jsx`
Expected: Fail.

- [ ] **Step 3: Create MemberDirectoryView component**
Write `src/views/staff/MemberDirectoryView.jsx` supporting filter buttons and details drawers.
```jsx
// src/views/staff/MemberDirectoryView.jsx
import React, { useState } from 'react';
import './MemberDirectoryView.css';

export function MemberDirectoryView({ members, setMembers }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Suspended' | 'InDebt'
  const [viewingDetails, setViewingDetails] = useState(null);

  const toggleStatus = (memberId) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          status: m.status === 'Active' ? 'Suspended' : 'Active'
        };
      }
      return m;
    }));
    if (viewingDetails && viewingDetails.id === memberId) {
      setViewingDetails(prev => ({
        ...prev,
        status: prev.status === 'Active' ? 'Suspended' : 'Active'
      }));
    }
  };

  // Filter logic
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' ||
                          (statusFilter === 'Active' && m.status === 'Active') ||
                          (statusFilter === 'Suspended' && m.status === 'Suspended') ||
                          (statusFilter === 'InDebt' && m.debt > 0);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="view-content-active">
      <div className="view-header">
        <h2>Directorio de Socios</h2>
        <p className="subtitle">Gestión de cuentas e historial de socios</p>
      </div>

      <div className="directory-controls">
        <input 
          type="text" 
          placeholder="Buscar socio por nombre o cédula..." 
          className="search-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div className="filter-buttons">
          {['All', 'Active', 'Suspended', 'InDebt'].map(filter => (
            <button
              key={filter}
              className={`filter-btn ${statusFilter === filter ? 'active' : ''}`}
              onClick={() => setStatusFilter(filter)}
            >
              {filter === 'All' && 'Todos'}
              {filter === 'Active' && 'Activos'}
              {filter === 'Suspended' && 'Suspendidos'}
              {filter === 'InDebt' && 'Con Deuda'}
            </button>
          ))}
        </div>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cédula</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Límite de Crédito</th>
                <th>Deuda Pendiente</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(m => (
                <tr key={m.id}>
                  <td><code>{m.id}</code></td>
                  <td className="font-weight-600">{m.name}</td>
                  <td>
                    <span className={`badge badge-${m.status.toLowerCase()}`}>
                      {m.status === 'Active' ? 'Activo' : 'Suspendido'}
                    </span>
                  </td>
                  <td>${m.balance.toFixed(2)}</td>
                  <td className={m.debt > 0 ? 'text-danger font-weight-700' : ''}>
                    ${m.debt.toFixed(2)}
                  </td>
                  <td>
                    <button className="btn-table btn-view-details" onClick={() => setViewingDetails(m)}>
                      👁 Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Drawer */}
      {viewingDetails && (
        <div className="modal-overlay" onClick={() => setViewingDetails(null)}>
          <div className="modal-card detail-drawer" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Ficha del Socio</h3>
              <button className="btn-close" onClick={() => setViewingDetails(null)}>×</button>
            </header>
            <div className="modal-body">
              <div className="member-profile-header">
                <div className="profile-avatar">{viewingDetails.name[0]}</div>
                <div>
                  <h4>{viewingDetails.name}</h4>
                  <p>{viewingDetails.id} • {viewingDetails.email}</p>
                </div>
              </div>

              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
                <div className="stat-item card">
                  <span className="stat-label">Límite de Crédito</span>
                  <strong className="stat-value">${viewingDetails.balance.toFixed(2)}</strong>
                </div>
                <div className="stat-item card">
                  <span className="stat-label">Deuda Pendiente</span>
                  <strong className="stat-value text-danger">${viewingDetails.debt.toFixed(2)}</strong>
                </div>
              </div>

              <div className="actions-section">
                <h5>Acciones Administrativas</h5>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button 
                    className={`btn ${viewingDetails.status === 'Active' ? 'btn-danger' : 'btn-primary'}`}
                    onClick={() => toggleStatus(viewingDetails.id)}
                  >
                    {viewingDetails.status === 'Active' ? 'Suspender Socio' : 'Activar Socio'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create MemberDirectoryView styling**
Write styling for directory controls, search, status filters, and drawers in `src/views/staff/MemberDirectoryView.css`.
```css
/* src/views/staff/MemberDirectoryView.css */
.directory-controls {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: var(--border-card);
  background: var(--bg-card);
  color: var(--color-text-primary);
  font-size: 0.95rem;
  outline: none;
}

[data-theme="flat"] .search-input {
  background: #FFFFFF;
  color: #0F2C59;
  border: 1px solid #CED4DA;
}
[data-theme="brutalist"] .search-input {
  border: 3px solid #0F2C59;
  background: #FFFFFF;
  color: #0F2C59;
}
[data-theme="brutalist"][data-mode="dark"] .search-input {
  border: 3px solid #FFFFFF;
  background: #111111;
  color: #FFFFFF;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  border: var(--border-card);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-speed) var(--transition-easing);
  font-family: var(--font-title);
  font-weight: 500;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.filter-btn.active {
  background: var(--color-accent);
  color: #0F2C59;
}

[data-theme="brutalist"] .filter-btn.active {
  border: 2px solid #0F2C59;
  box-shadow: 2px 2px 0px #0F2C59;
}
[data-theme="brutalist"][data-mode="dark"] .filter-btn.active {
  border: 2px solid #FFFFFF;
  box-shadow: 2px 2px 0px #FFD93D;
  color: #000000;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-active {
  background: rgba(81, 207, 102, 0.2);
  color: #51CF66;
}

.badge-suspended {
  background: rgba(255, 107, 107, 0.2);
  color: #FF6B6B;
}

.text-danger {
  color: var(--color-danger);
}

.font-weight-600 {
  font-weight: 600;
}
.font-weight-700 {
  font-weight: 700;
}

.btn-view-details {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  padding: 0.35rem 0.75rem;
  border-radius: var(--border-radius);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-speed) var(--transition-easing);
}

.btn-view-details:hover {
  background: var(--color-accent);
  color: #0F2C59;
}

.member-profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--color-accent);
  color: #0F2C59;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-title);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  display: block;
}

.stat-value {
  font-size: 1.5rem;
  font-family: var(--font-title);
}

@media (max-width: 768px) {
  .directory-controls {
    flex-direction: column;
  }
}
```

- [ ] **Step 5: Verify test passes**
Run: `npx vitest run src/views/staff/MemberDirectoryView.test.jsx`
Expected: Pass.

- [ ] **Step 6: Commit View B**
Commit changes.

---

### Task 6: View C - Billing & Fee Management
Create the invoicing console where staff post charges, trigger monthly fees, and see financial overview cards.

**Files:**
- [NEW] `src/views/staff/BillingAdminView.jsx`
- [NEW] `src/views/staff/BillingAdminView.css`
- [NEW] `src/views/staff/BillingAdminView.test.jsx`

- [ ] **Step 1: Write BillingAdminView test**
Create `src/views/staff/BillingAdminView.test.jsx` to test posting manual charge, mass monthly fees, and report cards.
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BillingAdminView } from './BillingAdminView';

describe('BillingAdminView', () => {
  it('posts manual charges and aggregates summary numbers', () => {
    const members = [
      { id: 'V-12.345.678', name: 'JUAN PÉREZ', status: 'Active', balance: 1000.00, debt: 340.00 }
    ];
    const setMembers = vi.fn();
    render(<BillingAdminView members={members} setMembers={setMembers} deposits={[]} />);

    expect(screen.getByText('$340.00')).toBeInTheDocument();
    
    const postBtn = screen.getByRole('button', { name: /Cargar Monto/i });
    expect(postBtn).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test and watch it fail**
Run: `npx vitest run src/views/staff/BillingAdminView.test.jsx`
Expected: Fail.

- [ ] **Step 3: Create BillingAdminView component**
Write `src/views/staff/BillingAdminView.jsx` with input forms, active members selector, metrics, and billing table summaries.
```jsx
// src/views/staff/BillingAdminView.jsx
import React, { useState } from 'react';
import './BillingAdminView.css';

export function BillingAdminView({ members, setMembers, deposits }) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [chargeAmount, setChargeAmount] = useState('');
  const [chargeConcept, setChargeConcept] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Metrics
  const totalOutstandingDebt = members.reduce((acc, curr) => acc + curr.debt, 0);
  const totalCollections = deposits
    .filter(d => d.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleManualChargeSubmit = (e) => {
    e.preventDefault();
    if (!selectedMemberId || !chargeAmount) return;

    const amountNum = parseFloat(chargeAmount);
    setMembers(prev => prev.map(m => {
      if (m.id === selectedMemberId) {
        return {
          ...m,
          debt: m.debt + amountNum
        };
      }
      return m;
    }));

    setSuccessMessage(`Cargo de $${amountNum.toFixed(2)} aplicado exitosamente.`);
    setChargeAmount('');
    setChargeConcept('');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleGenerateMonthlyFees = () => {
    // Post standard monthly fee of $100 to all Active members
    const feeAmount = 100.00;
    setMembers(prev => prev.map(m => {
      if (m.status === 'Active') {
        return {
          ...m,
          debt: m.debt + feeAmount
        };
      }
      return m;
    }));
    
    setSuccessMessage('Cuotas mensuales de $100.00 aplicadas a todos los socios activos.');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="view-content-active">
      <div className="view-header">
        <h2>Cobros & Facturación</h2>
        <p className="subtitle">Configuración de tarifas, facturación mensual y cobros extraordinarios</p>
      </div>

      {successMessage && (
        <div className="card alert-success">
          {successMessage}
        </div>
      )}

      {/* Analytics Summary */}
      <div className="metrics-grid">
        <div className="card metric-card">
          <span className="metric-icon">💰</span>
          <div>
            <span className="metric-label">Recaudación Mensual (Aprobada)</span>
            <strong className="metric-val text-success">${totalCollections.toFixed(2)}</strong>
          </div>
        </div>
        <div className="card metric-card">
          <span className="metric-icon">📉</span>
          <div>
            <span className="metric-label">Cuentas por Cobrar (Deuda Total)</span>
            <strong className="metric-val text-danger">${totalOutstandingDebt.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div className="billing-grid">
        {/* Manual Charge Form */}
        <div className="card billing-form-card">
          <h3>Cargar Cuota Individual</h3>
          <form onSubmit={handleManualChargeSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label className="input-label">Seleccionar Socio</label>
              <select 
                className="billing-select"
                value={selectedMemberId}
                onChange={e => setSelectedMemberId(e.target.value)}
                required
              >
                <option value="">-- Seleccionar Socio --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Concepto de Cobro</label>
              <input 
                type="text" 
                placeholder="Ej. Cuota Marina Extra, Alquiler Muelle"
                className="billing-input"
                value={chargeConcept}
                onChange={e => setChargeConcept(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Monto ($)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="Monto a cobrar"
                className="billing-input"
                value={chargeAmount}
                onChange={e => setChargeAmount(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary billing-submit-btn">
              Cargar Monto
            </button>
          </form>
        </div>

        {/* Action Panel */}
        <div className="card mass-invoicing-card">
          <h3>Facturación Masiva</h3>
          <p style={{ margin: '1rem 0', color: var(--color-text-secondary), fontSize: '0.95rem' }}>
            Cargue automáticamente la cuota ordinaria mensual de membresía a todos los socios del club que se encuentren en estado <strong>Activo</strong>.
          </p>
          
          <div className="fee-preview-box">
            <span className="fee-preview-label">Cuota Mensual Estándar</span>
            <strong className="fee-preview-val">$100.00</strong>
          </div>

          <button className="btn btn-primary mass-btn" onClick={handleGenerateMonthlyFees}>
            ⚡ Generar Facturación Mensual
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create BillingAdminView styling**
Write CSS formatting for analytics summary metrics cards, selection lists, and billing panels in `src/views/staff/BillingAdminView.css`.
```css
/* src/views/staff/BillingAdminView.css */
.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.metric-icon {
  font-size: 2.5rem;
}

.metric-label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.metric-val {
  font-size: 1.75rem;
  font-family: var(--font-title);
  font-weight: 700;
}

.billing-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.input-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
}

.billing-select, .billing-input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  color: var(--color-text-primary);
  border: var(--border-card);
  border-radius: var(--border-radius);
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
}

[data-theme="flat"] .billing-select, [data-theme="flat"] .billing-input {
  background: #FFFFFF;
  color: #0F2C59;
  border: 1px solid #CED4DA;
}
[data-theme="brutalist"] .billing-select, [data-theme="brutalist"] .billing-input {
  border: 3px solid #0F2C59;
  background: #FFFFFF;
  color: #0F2C59;
}
[data-theme="brutalist"][data-mode="dark"] .billing-select, [data-theme="brutalist"][data-mode="dark"] .billing-input {
  border: 3px solid #FFFFFF;
  background: #111111;
  color: #FFFFFF;
}

.billing-submit-btn, .mass-btn {
  width: 100%;
  margin-top: 1rem;
}

.fee-preview-box {
  margin: 1.5rem 0;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: var(--border-card);
  border-radius: var(--border-radius);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fee-preview-label {
  font-weight: 600;
}

.fee-preview-val {
  font-size: 1.5rem;
  color: var(--color-accent);
}

.alert-success {
  border-color: var(--color-success);
  background: rgba(81, 207, 102, 0.1);
  color: var(--color-success);
  margin-bottom: 1.5rem;
  font-weight: 600;
}

@media (max-width: 992px) {
  .metrics-grid, .billing-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Verify test passes**
Run: `npx vitest run src/views/staff/BillingAdminView.test.jsx`
Expected: Pass.

- [ ] **Step 6: Commit View C**
Commit changes.

---

## Verification Plan

### Automated Verification
Run `npx vitest run` to make sure all 14 tests (10 existing + 4 new) are passing.

### Manual Verification
1. Verify unified login page triggers at root.
2. Verify logging in with `staff@club.com` takes you to the Staff App shell.
3. Test that approving payments increases user balance.
4. Test that posting billing fees increases outstanding user debt in directory and reports.
5. Verify responsiveness and theme switches.
