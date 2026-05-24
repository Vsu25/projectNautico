import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './VerifyDepositsView.css';

export function VerifyDepositsView({ deposits, setDeposits, members, setMembers, purchases }) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [rejectionTarget, setRejectionTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Find associated purchase order
  const getMemberAccount = (memberId) => {
    const member = members?.find(m => m.id === memberId);
    return member?.accountNumber ? `#${member.accountNumber}` : '';
  };

  const associatedPurchase = selectedReceipt && purchases
    ? purchases.find(p => p.id === selectedReceipt.invoiceId || (p.user_id === selectedReceipt.memberId && Math.abs(p.amount_usd - selectedReceipt.amount) < 0.01))
    : null;

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
                    <td data-label="Socio">
                      <div className="member-cell">
                        <span className="member-name">
                          {dep.name}
                          {getMemberAccount(dep.memberId) && <span style={{ color: 'var(--color-accent)', marginLeft: '0.4rem', fontWeight: 'bold' }}>{getMemberAccount(dep.memberId)}</span>}
                        </span>
                        <span className="member-id">{dep.memberId}</span>
                      </div>
                    </td>
                    <td data-label="Fecha">{dep.date}</td>
                    <td data-label="Monto" className="amount-cell">${dep.amount.toFixed(2)}</td>
                    <td data-label="Referencia"><code>{dep.reference}</code></td>
                    <td data-label="Comprobante">
                      <button className="btn-view-receipt" onClick={() => setSelectedReceipt(dep)}>
                        📄 Ver Recibo
                      </button>
                    </td>
                    <td data-label="Acciones">
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
      {selectedReceipt && createPortal(
        <div className="modal-overlay" onClick={() => setSelectedReceipt(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '100%' }}>
            <header className="modal-header">
              <h3>Comprobante & Detalle de Factura</h3>
              <button className="btn-close" onClick={() => setSelectedReceipt(null)}>×</button>
            </header>
            <div className="modal-body text-center">
              <p className="receipt-ref-label">Referencia: <code>{selectedReceipt.reference}</code></p>
              <div className="mock-receipt-image">
                <div className="receipt-header">Banco Central</div>
                <div className="receipt-row"><span>Transacción:</span> <span>{selectedReceipt.reference}</span></div>
                <div className="receipt-row"><span>Monto:</span> <strong>${selectedReceipt.amount.toFixed(2)}</strong></div>
                <div className="receipt-row">
                  <span>Socio:</span>
                  <span>
                    {selectedReceipt.name}
                    {getMemberAccount(selectedReceipt.memberId) && <span style={{ color: 'var(--color-accent)', marginLeft: '0.4rem', fontWeight: 'bold' }}>{getMemberAccount(selectedReceipt.memberId)}</span>}
                  </span>
                </div>
                <div className="receipt-stamp">VALIDADO POR BANCO</div>
              </div>

              {associatedPurchase && (
                <div className="associated-invoice-details" style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(197, 168, 128, 0.2)', paddingTop: '1.2rem', textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '0.4rem', color: 'var(--color-accent)' }}>Consumos Facturados: {associatedPurchase.id}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.6rem' }}>
                    Descripción: {associatedPurchase.description}
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
                        <td colSpan="3" style={{ padding: '0.4rem' }}>Total Facturado</td>
                        <td style={{ padding: '0.4rem', textAlign: 'right' }}>${associatedPurchase.amount_usd.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Reject Modal */}
      {rejectionTarget && createPortal(
        <div className="modal-overlay">
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Rechazar Depósito</h3>
              <button className="btn-close" onClick={() => setRejectionTarget(null)}>×</button>
            </header>
            <form onSubmit={handleRejectSubmit} className="modal-body">
              <p>Indique el motivo del rechazo para <strong>{rejectionTarget.name} {getMemberAccount(rejectionTarget.memberId)}</strong>:</p>
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
        </div>,
        document.body
      )}
    </div>
  );
}
