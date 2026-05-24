import React, { useState } from 'react';
import './PaymentsHistoryView.css';

export function PaymentsHistoryView({ deposits, purchases }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredDeposits = deposits.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.memberId.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesStatus = statusFilter === 'All' ||
                          (statusFilter === 'Pending' && d.status === 'Pending') ||
                          (statusFilter === 'Approved' && (d.status === 'manually_approved' || d.status === 'auto_approved' || d.status === 'Approved')) ||
                          (statusFilter === 'Rejected' && d.status === 'rejected') ||
                          (statusFilter === 'Cancelled' && d.status === 'cancelled');

    return matchesSearch && matchesStatus;
  });

  // Find associated purchase for selected payment
  const associatedPurchase = selectedPayment && purchases
    ? purchases.find(p => p.id === selectedPayment.invoiceId || (p.user_id === selectedPayment.memberId && Math.abs(p.amount_usd - selectedPayment.amount) < 0.01))
    : null;

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
                <th>Acciones</th>
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
                      {dep.status === 'Approved' && 'Aprobado'}
                      {dep.status === 'rejected' && 'Rechazado'}
                      {dep.status === 'cancelled' && 'Cancelado'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-view-receipt" 
                      onClick={() => setSelectedPayment(dep)}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      🔍 Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment details modal containing what's being billed */}
      {selectedPayment && (
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '100%' }}>
            <header className="modal-header">
              <h3>Auditoría de Transacción</h3>
              <button className="btn-close" onClick={() => setSelectedPayment(null)}>×</button>
            </header>
            
            <div className="modal-body">
              <div className="credit-summary card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', marginBottom: '1.2rem', border: 'var(--border-card)' }}>
                <h4 style={{ marginBottom: '0.8rem', color: 'var(--color-accent)' }}>Información del Ticket</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div><strong>Referencia:</strong> <code>{selectedPayment.reference}</code></div>
                  <div><strong>Socio:</strong> {selectedPayment.name} ({selectedPayment.memberId})</div>
                  <div><strong>Monto:</strong> ${selectedPayment.amount.toFixed(2)}</div>
                  <div><strong>Fecha de Reporte:</strong> {selectedPayment.date}</div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong>Estado:</strong> 
                    <span className={`badge badge-${selectedPayment.status.toLowerCase()}`} style={{ marginLeft: '0.4rem' }}>
                      {selectedPayment.status}
                    </span>
                  </div>
                </div>
              </div>

              {associatedPurchase ? (
                <div className="associated-invoice-details" style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(197, 168, 128, 0.2)', paddingTop: '1.2rem' }}>
                  <h4 style={{ marginBottom: '0.4rem', color: 'var(--color-accent)' }}>Detalles de Facturación ({associatedPurchase.id})</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.8rem' }}>
                    Factura correspondiente a: <strong>{associatedPurchase.description}</strong>
                  </p>
                  
                  <table className="mini-trace-table" style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.05)' }}>
                        <th style={{ padding: '0.4rem', textAlign: 'left' }}>Concepto</th>
                        <th style={{ padding: '0.4rem', textAlign: 'center' }}>Cant.</th>
                        <th style={{ padding: '0.4rem', textAlign: 'right' }}>Precio</th>
                        <th style={{ padding: '0.4rem', textAlign: 'right' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(associatedPurchase.items || [{ name: associatedPurchase.description, qty: 1, price: associatedPurchase.amount_usd }]).map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: 'var(--border-card)' }}>
                          <td style={{ padding: '0.4rem' }}>{item.name}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center' }}>{item.qty}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'right' }}>${(item.qty * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: 'bold' }}>
                        <td colSpan="3" style={{ padding: '0.4rem' }}>Total Cobrado</td>
                        <td style={{ padding: '0.4rem', textAlign: 'right' }}>${associatedPurchase.amount_usd.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  No se encontró una factura de consumo sincronizada vinculada directamente a esta transferencia.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
