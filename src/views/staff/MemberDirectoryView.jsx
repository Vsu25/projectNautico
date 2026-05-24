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
