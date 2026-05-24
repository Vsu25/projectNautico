import React, { useState } from 'react';
import './MemberDirectoryView.css';

export function MemberDirectoryView({ members, setMembers, purchases, deposits }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingDetails, setViewingDetails] = useState(null);
  const [newCreditLimit, setNewCreditLimit] = useState('');

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

  const handleUpdateCreditLimit = (e) => {
    e.preventDefault();
    if (!newCreditLimit || !viewingDetails) return;
    const limitNum = parseFloat(newCreditLimit);
    
    setMembers(prev => prev.map(m => {
      if (m.id === viewingDetails.id) {
        return {
          ...m,
          balance: limitNum
        };
      }
      return m;
    }));
    
    setViewingDetails(prev => ({
      ...prev,
      balance: limitNum
    }));
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

  const memberPurchases = viewingDetails ? purchases.filter(p => p.user_id === viewingDetails.id) : [];
  const memberDeposits = viewingDetails ? deposits.filter(d => d.memberId === viewingDetails.id) : [];

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
            <div className="modal-body drawer-scroll-body">
              <div className="member-profile-header">
                <div className="profile-avatar">{viewingDetails.name[0]}</div>
                <div>
                  <h4>{viewingDetails.name}</h4>
                  <p>{viewingDetails.id} • {viewingDetails.email}</p>
                  <span className={`badge badge-${viewingDetails.status.toLowerCase()}`} style={{ display: 'inline-block', marginTop: '0.25rem' }}>
                    {viewingDetails.status === 'Active' ? 'Activo' : 'Suspendido'}
                  </span>
                </div>
              </div>

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
                    style={{ flex: 1, padding: '0.5rem' }}
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
                  <p className="no-data" style={{ padding: '0.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Sin consumos registrados.</p>
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
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span className={`status-dot dot-${p.status}`}></span>
                              {p.status === 'pending' ? 'Pendiente' : 'Pagado'}
                            </span>
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
                  <p className="no-data" style={{ padding: '0.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Sin pagos reportados.</p>
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
                          <td>
                            <span className={`badge badge-${d.status.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem' }}>
                              {d.status === 'Pending' && 'Pendiente'}
                              {d.status === 'auto_approved' && 'Automático'}
                              {d.status === 'manually_approved' && 'Aprobado'}
                              {d.status === 'rejected' && 'Rechazado'}
                              {d.status === 'cancelled' && 'Cancelado'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="actions-section" style={{ borderTop: 'var(--border-card)', paddingTop: '1rem', marginTop: '1.5rem' }}>
                <button 
                  className={`btn ${viewingDetails.status === 'Active' ? 'btn-danger' : 'btn-primary'}`}
                  onClick={() => toggleStatus(viewingDetails.id)}
                  style={{ width: '100%' }}
                >
                  {viewingDetails.status === 'Active' ? '🚫 Suspender Socio' : '✓ Activar Socio'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
