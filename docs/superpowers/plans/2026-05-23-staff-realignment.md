# Staff Dashboard Realignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Realign the Staff Panel mockup with the database and business rules specified in the `PROYECTO_FINTECH.md` docs. Specifically, convert billing generation into read-only external transcripts, add a comprehensive payments history log (verified, auto-approved, pending, cancelled, rejected), and enhance the partner directory with credit limit adjustments and purchase-to-payment traceability.

**Architecture:**
- **Navigation (4 Tabs):**
  1. `verify`: Verify Deposits Queue (active pending audit approvals).
  2. `payments`: Payment Transactions Log (all states: verified, pending, cancelled, rejected).
  3. `directory`: Partner Directory (search, suspend, edit credit limit, and view individual purchases/payment ticket ledgers).
  4. `billing`: Billing & Transcripts (read-only chronological consumption logs synced from external system).
- **Shared State in `App.jsx`:**
  - `members`: Database table `users` + `credit_accounts`.
  - `deposits`: Database table `payment_tickets`.
  - `purchases`: Database table `purchases_orders` (representing purchases injected from the external Club social system).

**Tech Stack:** React, Vite, Vanilla CSS, Vitest.

---

## Proposed Changes

### Task 1: Navigation and State Extension in App.jsx
Expand mock databases to include purchase orders and configure 4-tab staff layout routing.

**Files:**
- [MODIFY] `src/App.jsx`
- [MODIFY] `src/components/StaffLayout.jsx`
- [MODIFY] `src/components/StaffLayout.test.jsx`

- [ ] **Step 1: Expand App.jsx Mock Database**
Add `purchases` state representing `purchases_orders` table. Extend mock deposits to contain all status types (`auto_approved`, `cancelled`, `rejected`, `manually_approved`).
Modify `App.jsx`:
```jsx
// Add purchase orders database representing injected orders
const initialPurchases = [
  { id: 'INV-101', user_id: 'V-12.345.678', amount_usd: 150.00, description: 'Consumo Rest. La Marina', status: 'paid_with_transfer', created_at: '2026-05-23' },
  { id: 'INV-102', user_id: 'V-12.345.678', amount_usd: 95.50, description: 'Alquiler Cancha Tenis', status: 'paid_with_transfer', created_at: '2026-05-22' },
  { id: 'INV-103', user_id: 'V-12.345.678', amount_usd: 100.00, description: 'Mensualidad Club Mayo', status: 'pending', created_at: '2026-05-01' },
  { id: 'INV-104', user_id: 'V-23.456.789', amount_usd: 150.00, description: 'Consumo Bar Piscina', status: 'pending', created_at: '2026-05-22' },
  { id: 'INV-105', user_id: 'V-34.567.890', name: 'CARLOS GÓMEZ', amount_usd: 450.00, description: 'Cuota Mantenimiento Muelle', status: 'pending', created_at: '2026-05-15' }
];

// Seed deposits queue containing all payment_tickets statuses
const initialDeposits = [
  { id: 'DEP-001', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-23', amount: 150.00, reference: 'REF982347', status: 'Pending', receipt: 'receipt_mock.png' },
  { id: 'DEP-002', memberId: 'V-23.456.789', name: 'MARÍA RODRÍGUEZ', date: '2026-05-22', amount: 100.00, reference: 'REF109283', status: 'Pending', receipt: 'receipt_mock.png' },
  { id: 'DEP-003', memberId: 'V-34.567.890', name: 'CARLOS GÓMEZ', date: '2026-05-20', amount: 450.00, reference: 'REF554312', status: 'Pending', receipt: 'receipt_mock.png' },
  { id: 'DEP-004', memberId: 'V-45.678.901', name: 'ANA MARTÍNEZ', date: '2026-05-18', amount: 300.00, reference: 'REF111222', status: 'auto_approved', receipt: 'receipt_mock.png' },
  { id: 'DEP-005', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-15', amount: 95.50, reference: 'REF887766', status: 'manually_approved', receipt: 'receipt_mock.png' },
  { id: 'DEP-006', memberId: 'V-23.456.789', name: 'MARÍA RODRÍGUEZ', date: '2026-05-10', amount: 50.00, reference: 'REF999000', status: 'rejected', rejectionReason: 'Comprobante borroso', receipt: 'receipt_mock.png' }
];
```

- [ ] **Step 2: Update StaffLayout tabs**
Modify `src/components/StaffLayout.jsx` tabs list:
```jsx
  const tabs = [
    { id: 'verify', label: 'Verificar Pagos', icon: '🔍' },
    { id: 'payments', label: 'Transacciones', icon: '🧾' },
    { id: 'directory', label: 'Directorio Socios', icon: '👥' },
    { id: 'billing', label: 'Facturación', icon: '📊' }
  ];
```

- [ ] **Step 3: Update App.jsx Routing Switch**
Integrate `PaymentsHistoryView` view and pass `purchases` props down to directory and billing.
Modify `App.jsx` switch:
```jsx
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
            setPurchases={setPurchases}
          />
        );
      case 'payments':
        return (
          <PaymentsHistoryView 
            deposits={deposits} 
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
```

- [ ] **Step 4: Update StaffLayout test**
Modify `src/components/StaffLayout.test.jsx` to test updated tab text (e.g. checking for "Transacciones").

- [ ] **Step 5: Verify tests pass**
Run: `npx vitest run src/components/StaffLayout.test.jsx`

- [ ] **Step 6: Commit state changes**

---

### Task 2: View B - Payments History View (Transactions Log)
Create the transaction ledger containing all payments (verified, auto-approved, pending, cancelled, rejected).

**Files:**
- [NEW] `src/views/staff/PaymentsHistoryView.jsx`
- [NEW] `src/views/staff/PaymentsHistoryView.css`
- [NEW] `src/views/staff/PaymentsHistoryView.test.jsx`

- [ ] **Step 1: Write PaymentsHistoryView test**
Create `src/views/staff/PaymentsHistoryView.test.jsx` to render approved and rejected payments list and check status badges.
```javascript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PaymentsHistoryView } from './PaymentsHistoryView';

describe('PaymentsHistoryView', () => {
  it('renders list of all payments and status filters', () => {
    const deposits = [
      { id: 'DEP-001', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-23', amount: 150.00, reference: 'REF982347', status: 'Pending' },
      { id: 'DEP-002', memberId: 'V-23.456.789', name: 'MARÍA RODRÍGUEZ', date: '2026-05-22', amount: 100.00, reference: 'REF109283', status: 'auto_approved' }
    ];

    render(<PaymentsHistoryView deposits={deposits} />);
    expect(screen.getByText('REF982347')).toBeInTheDocument();
    expect(screen.getByText('REF109283')).toBeInTheDocument();
    expect(screen.getByText(/Automático/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test and watch it fail**
Run: `npx vitest run src/views/staff/PaymentsHistoryView.test.jsx`
Expected: Fail.

- [ ] **Step 3: Create PaymentsHistoryView component**
Write `src/views/staff/PaymentsHistoryView.jsx` displaying search bar, status filters (Aprobados, Auto, Pendientes, Rechazados), and a datatable.
```jsx
// src/views/staff/PaymentsHistoryView.jsx
import React, { useState } from 'react';
import './PaymentsHistoryView.css';

export function PaymentsHistoryView({ deposits }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredDeposits = deposits.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.memberId.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesStatus = statusFilter === 'All' ||
                          (statusFilter === 'Pending' && d.status === 'Pending') ||
                          (statusFilter === 'Approved' && (d.status === 'manually_approved' || d.status === 'auto_approved')) ||
                          (statusFilter === 'Rejected' && d.status === 'rejected') ||
                          (statusFilter === 'Cancelled' && d.status === 'cancelled');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="view-content-active">
      <div className="view-header">
        <h2>Historial General de Pagos</h2>
        <p className="subtitle">Auditoría y trazabilidad de todos los comprobantes reportados</p>
      </div>

      <div className="directory-controls">
        <input 
          type="text" 
          placeholder="Buscar por referencia, socio o cédula..." 
          className="search-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div className="filter-buttons">
          {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map(filter => (
            <button
              key={filter}
              className={`filter-btn ${statusFilter === filter ? 'active' : ''}`}
              onClick={() => setStatusFilter(filter)}
            >
              {filter === 'All' && 'Todos'}
              {filter === 'Pending' && 'Pendientes'}
              {filter === 'Approved' && 'Aprobados'}
              {filter === 'Rejected' && 'Rechazados'}
              {filter === 'Cancelled' && 'Cancelados'}
            </button>
          ))}
        </div>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Socio</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Detalles de Auditoría</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.map(dep => (
                <tr key={dep.id}>
                  <td><code>{dep.reference}</code></td>
                  <td>
                    <div className="member-cell">
                      <span className="member-name">{dep.name}</span>
                      <span className="member-id">{dep.memberId}</span>
                    </div>
                  </td>
                  <td>{dep.date}</td>
                  <td className="amount-cell">${dep.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${dep.status.toLowerCase()}`}>
                      {dep.status === 'Pending' && 'Pendiente'}
                      {dep.status === 'auto_approved' && 'Automático'}
                      {dep.status === 'manually_approved' && 'Aprobado Manual'}
                      {dep.status === 'rejected' && 'Rechazado'}
                      {dep.status === 'cancelled' && 'Cancelado'}
                    </span>
                  </td>
                  <td>
                    <span className="audit-detail">
                      {dep.status === 'rejected' && `Motivo: ${dep.rejectionReason}`}
                      {dep.status === 'manually_approved' && 'Verificado por Caja'}
                      {dep.status === 'auto_approved' && 'Conciliado por Banco'}
                      {dep.status === 'Pending' && 'En espera de revisión'}
                      {dep.status === 'cancelled' && 'Anulado por Socio'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create PaymentsHistoryView styles**
Write styling for status badges (`badge-auto_approved`, `badge-manually_approved`, `badge-rejected`) in `src/views/staff/PaymentsHistoryView.css`.
```css
/* src/views/staff/PaymentsHistoryView.css */
.audit-detail {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.badge-pending {
  background: rgba(252, 196, 25, 0.2);
  color: #FCC419;
}

.badge-auto_approved {
  background: rgba(81, 207, 102, 0.2);
  color: #51CF66;
}

.badge-manually_approved {
  background: rgba(81, 207, 102, 0.35);
  color: var(--color-success);
}

.badge-rejected {
  background: rgba(255, 107, 107, 0.2);
  color: #FF6B6B;
}

.badge-cancelled {
  background: rgba(173, 181, 189, 0.2);
  color: #ADB5BD;
}
```

- [ ] **Step 5: Verify test passes**
Run: `npx vitest run src/views/staff/PaymentsHistoryView.test.jsx`

- [ ] **Step 6: Commit View B**

---

### Task 3: Enhance Partner Directory (Credit Modifier + Traceability Ledgers)
Equip the directory with credit limit adjustments and purchase-to-payment traceability ledgers.

**Files:**
- [MODIFY] `src/views/staff/MemberDirectoryView.jsx`
- [MODIFY] `src/views/staff/MemberDirectoryView.css`
- [MODIFY] `src/views/staff/MemberDirectoryView.test.jsx`

- [ ] **Step 1: Write MemberDirectoryView extended test**
Modify `src/views/staff/MemberDirectoryView.test.jsx` to test adjusting the credit limit limit button and rendering purchase trace rows.

- [ ] **Step 2: Update MemberDirectoryView component**
Add `purchases` and `deposits` props. Render two sub-tables inside the detail drawer: "Cuentas y Compras del Club" and "Reportes de Pago".
Add credit limit modifier form.
Modify `MemberDirectoryView.jsx`:
```jsx
// src/views/staff/MemberDirectoryView.jsx
import React, { useState } from 'react';
import './MemberDirectoryView.css';

export function MemberDirectoryView({ members, setMembers, purchases, deposits }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingDetails, setViewingDetails] = useState(null);
  const [newCreditLimit, setNewCreditLimit] = useState('');

  const toggleStatus = (memberId) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: m.status === 'Active' ? 'Suspended' : 'Active' } : m));
    if (viewingDetails && viewingDetails.id === memberId) {
      setViewingDetails(prev => ({ ...prev, status: prev.status === 'Active' ? 'Suspended' : 'Active' }));
    }
  };

  const handleUpdateCreditLimit = (e) => {
    e.preventDefault();
    if (!newCreditLimit || !viewingDetails) return;
    const limitNum = parseFloat(newCreditLimit);
    
    setMembers(prev => prev.map(m => m.id === viewingDetails.id ? { ...m, balance: limitNum } : m));
    setViewingDetails(prev => ({ ...prev, balance: limitNum }));
    setNewCreditLimit('');
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' ||
                          (statusFilter === 'Active' && m.status === 'Active') ||
                          (statusFilter === 'Suspended' && m.status === 'Suspended') ||
                          (statusFilter === 'InDebt' && m.debt > 0);
    return matchesSearch && matchesStatus;
  });

  // Get specific trace records
  const memberPurchases = viewingDetails ? purchases.filter(p => p.user_id === viewingDetails.id) : [];
  const memberDeposits = viewingDetails ? deposits.filter(d => d.memberId === viewingDetails.id) : [];

  return (
    <div className="view-content-active">
      {/* ... header controls and directory table ... */}
      {/* Drawer detailed below */}
    </div>
  );
}
```
Inside the Detail Drawer:
```jsx
            <div className="modal-body drawer-scroll-body">
              <div className="member-profile-header">
                <div className="profile-avatar">{viewingDetails.name[0]}</div>
                <div>
                  <h4>{viewingDetails.name}</h4>
                  <p>{viewingDetails.id} • {viewingDetails.email}</p>
                  <span className={`badge badge-${viewingDetails.status.toLowerCase()}`}>
                    {viewingDetails.status === 'Active' ? 'Activo' : 'Suspendido'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
                <div className="stat-item card">
                  <span className="stat-label">Límite de Crédito</span>
                  <strong className="stat-value">${viewingDetails.balance.toFixed(2)}</strong>
                </div>
                <div className="stat-item card">
                  <span className="stat-label">Saldo Deudor</span>
                  <strong className="stat-value text-danger">${viewingDetails.debt.toFixed(2)}</strong>
                </div>
              </div>

              {/* Adjust Credit Limit Tool */}
              <div className="admin-tool-card card" style={{ marginBottom: '1.5rem' }}>
                <h5>Gestionar Línea de Crédito</h5>
                <form onSubmit={handleUpdateCreditLimit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="number" 
                    placeholder="Nuevo Límite USD"
                    className="billing-input"
                    value={newCreditLimit}
                    onChange={e => setNewCreditLimit(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    Actualizar
                  </button>
                </form>
              </div>

              {/* Traceability: Purchases */}
              <div className="trace-section" style={{ marginBottom: '1.5rem' }}>
                <h5>Compras y Consumos (Externo DB Sync)</h5>
                {memberPurchases.length === 0 ? (
                  <p className="no-data">Sin consumos registrados.</p>
                ) : (
                  <table className="mini-trace-table">
                    <thead>
                      <tr>
                        <th>Factura</th>
                        <th>Concepto</th>
                        <th>Monto</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberPurchases.map(p => (
                        <tr key={p.id}>
                          <td><code>{p.id}</code></td>
                          <td>{p.description}</td>
                          <td>${p.amount_usd.toFixed(2)}</td>
                          <td>
                            <span className={`status-dot dot-${p.status}`}></span>
                            {p.status === 'pending' ? 'Pendiente' : 'Pagado'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Traceability: Reported Payments */}
              <div className="trace-section" style={{ marginBottom: '1.5rem' }}>
                <h5>Reportes de Pago Relacionados</h5>
                {memberDeposits.length === 0 ? (
                  <p className="no-data">Sin pagos reportados.</p>
                ) : (
                  <table className="mini-trace-table">
                    <thead>
                      <tr>
                        <th>Referencia</th>
                        <th>Monto</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberDeposits.map(d => (
                        <tr key={d.id}>
                          <td><code>{d.reference}</code></td>
                          <td>${d.amount.toFixed(2)}</td>
                          <td>{d.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="actions-section" style={{ borderTop: 'var(--border-card)', paddingTop: '1rem' }}>
                <button 
                  className={`btn ${viewingDetails.status === 'Active' ? 'btn-danger' : 'btn-primary'}`}
                  onClick={() => toggleStatus(viewingDetails.id)}
                  style={{ width: '100%' }}
                >
                  {viewingDetails.status === 'Active' ? '🚫 Suspender Socio' : '✓ Activar Socio'}
                </button>
              </div>
            </div>
```

- [ ] **Step 3: Update CSS styling for drawers and mini tables**
Modify `src/views/staff/MemberDirectoryView.css` to add `drawer-scroll-body`, `mini-trace-table`, and `status-dot` rules.
```css
/* src/views/staff/MemberDirectoryView.css extension */
.drawer-scroll-body {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.mini-trace-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

.mini-trace-table th, .mini-trace-table td {
  padding: 0.5rem;
  border-bottom: var(--border-card);
  text-align: left;
}

.mini-trace-table th {
  color: var(--color-text-secondary);
  font-weight: 600;
  background: rgba(0,0,0,0.05);
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}
.dot-pending { background: var(--color-warning); }
.dot-paid_with_transfer, .dot-paid_with_credit { background: var(--color-success); }
```

- [ ] **Step 4: Verify test passes**
Run: `npx vitest run src/views/staff/MemberDirectoryView.test.jsx`

- [ ] **Step 5: Commit Directory updates**

---

### Task 4: View C - Billing & Transcripts (Read-Only)
Convert the active billing page into a read-only transcripts history dashboard showing database synchronized invoice logs.

**Files:**
- [MODIFY] `src/views/staff/BillingAdminView.jsx`
- [MODIFY] `src/views/staff/BillingAdminView.css`
- [MODIFY] `src/views/staff/BillingAdminView.test.jsx`

- [ ] **Step 1: Write BillingAdminView read-only test**
Update `src/views/staff/BillingAdminView.test.jsx` to verify that active forms are removed and read-only consumption logs render.

- [ ] **Step 2: Update BillingAdminView component**
Modify `BillingAdminView.jsx` to render cards displaying metrics synced from DB (Outstanding Receivables, Total Paid, Credit Utilization) and a table of consumption invoices synced from the Club's external system.
```jsx
// src/views/staff/BillingAdminView.jsx
import React from 'react';
import './BillingAdminView.css';

export function BillingAdminView({ members, purchases }) {
  // Aggregate Metrics from State
  const totalReceivables = members.reduce((acc, m) => acc + m.debt, 0);
  const totalInvoicedUsd = purchases.reduce((acc, p) => acc + p.amount_usd, 0);
  const totalPaidUsd = purchases
    .filter(p => p.status !== 'pending')
    .reduce((acc, p) => acc + p.amount_usd, 0);

  return (
    <div className="view-content-active">
      <div className="view-header">
        <h2>Facturación & Transcripción</h2>
        <p className="subtitle">Registro histórico de facturas importadas del sistema de consumo del Club</p>
      </div>

      <div className="metrics-grid">
        <div className="card metric-card">
          <span className="metric-icon">📊</span>
          <div>
            <span className="metric-label">Facturación Acumulada</span>
            <strong className="metric-val">${totalInvoicedUsd.toFixed(2)}</strong>
          </div>
        </div>
        <div className="card metric-card">
          <span className="metric-icon">💰</span>
          <div>
            <span className="metric-label">Monto Liquidado (Socio Transfer/Crédito)</span>
            <strong className="metric-val text-success">${totalPaidUsd.toFixed(2)}</strong>
          </div>
        </div>
        <div className="card metric-card" style={{ gridColumn: 'span 2' }}>
          <span className="metric-icon">📉</span>
          <div>
            <span className="metric-label">Cuentas por Cobrar Totales (Deuda Activa)</span>
            <strong className="metric-val text-danger">${totalReceivables.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div className="view-header" style={{ marginTop: '2rem' }}>
        <h3>Transcripción de Consumos Sincronizados (DB Sync)</h3>
        <p className="subtitle" style={{ fontSize: '0.85rem' }}>Historial inalterable de compras reportadas por el sistema externo del Club Social</p>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Factura ID</th>
                <th>Cédula Socio</th>
                <th>Fecha Sincronización</th>
                <th>Concepto / Descripción</th>
                <th>Monto (USD)</th>
                <th>Estado de Liquidación</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p.id}>
                  <td><code>{p.id}</code></td>
                  <td><code>{p.user_id}</code></td>
                  <td>{p.created_at}</td>
                  <td>{p.description}</td>
                  <td className="font-weight-700">${p.amount_usd.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${p.status}`}>
                      {p.status === 'pending' && 'Pendiente de Pago'}
                      {p.status === 'paid_with_transfer' && 'Pagado Directo'}
                      {p.status === 'paid_with_credit' && 'Cargado a Crédito'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update CSS styling**
Update `src/views/staff/BillingAdminView.css` to remove styling for active forms, adjust grid spacings for the metrics, and add badge overrides.
```css
/* src/views/staff/BillingAdminView.css extension */
.badge-pending {
  background: rgba(252, 196, 25, 0.2);
  color: #FCC419;
}
.badge-paid_with_transfer {
  background: rgba(81, 207, 102, 0.2);
  color: #51CF66;
}
.badge-paid_with_credit {
  background: rgba(229, 197, 131, 0.2);
  color: var(--color-accent);
}
```

- [ ] **Step 4: Verify test passes**
Run: `npx vitest run src/views/staff/BillingAdminView.test.jsx`

- [ ] **Step 5: Commit Billing updates**

---

## Verification Plan

### Automated Verification
Run `npx vitest run` to make sure all 17 tests (covering Login, layouts, and expanded admin views) pass cleanly.

### Manual Verification
1. Login as `staff@club.com` using the Quick-Login buttons.
2. Select **Transacciones** tab: verify all statuses (Aprobado Manual, Automático, Pendiente, Cancelado, Rechazado) render correctly with their audit details.
3. Select **Directorio Socios** tab: open Juan Pérez's drawer, verify the "Gestionar Línea de Crédito" tool works (adjusts limit from $1000 to e.g., $1500), and check the "Compras" and "Reportes" traceability tables.
4. Select **Facturación** tab: confirm that the billing is read-only, and displays the synchronized database records correctly.
5. Verify responsive and theme switching matrices.
