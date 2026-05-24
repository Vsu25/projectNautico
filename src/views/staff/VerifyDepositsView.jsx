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
