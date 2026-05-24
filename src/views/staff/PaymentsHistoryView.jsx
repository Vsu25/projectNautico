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
