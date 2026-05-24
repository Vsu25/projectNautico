import React from 'react';
import './HistorialView.css';

export function HistorialView({ currentUser, members = [], deposits = [] }) {
  const mockTickets = [
    { id: 'T-9001', date: '2026-05-18', method: 'Pago Móvil', bank: 'Banesco', amount: 120.00, status: 'auto_approved' },
    { id: 'T-9002', date: '2026-05-15', method: 'Transferencia', bank: 'Mercantil', amount: 350.00, status: 'pending_audit' },
    { id: 'T-9003', date: '2026-05-10', method: 'Pago Móvil', bank: 'Provincial', amount: 45.00, status: 'rejected' },
  ];

  // Find all member IDs in the same account to aggregate family payments
  const userMember = members?.find(m => m.id === currentUser?.id);
  const userAccount = userMember?.accountNumber;
  const accountMemberIds = (members && userAccount)
    ? members.filter(m => m.accountNumber === userAccount).map(m => m.id)
    : (currentUser?.id ? [currentUser.id] : []);

  const tickets = (deposits && deposits.length > 0 && currentUser)
    ? deposits
        .filter(dep => accountMemberIds.includes(dep.memberId))
        .map(dep => {
          let normStatus = dep.status;
          if (dep.status === 'Pending') normStatus = 'pending_audit';
          if (dep.status === 'manually_approved' || dep.status === 'Approved') normStatus = 'auto_approved';

          const isPagoMovil = dep.reference && dep.reference.toUpperCase().includes('PAGOMOVIL');
          const method = isPagoMovil ? 'Pago Móvil' : 'Transferencia';
          const bank = isPagoMovil ? 'Banesco' : 'Mercantil'; // stable mock banks

          return {
            id: dep.id,
            date: dep.date,
            method,
            bank,
            amount: dep.amount,
            status: normStatus,
            reference: dep.reference,
            name: dep.name
          };
        })
    : mockTickets;

  const getStatusLabel = (status) => {
    switch(status) {
      case 'auto_approved': return { text: 'Aprobado', class: 'status-success' };
      case 'pending_audit': return { text: 'En Revisión', class: 'status-warning' };
      case 'rejected': return { text: 'Rechazado', class: 'status-danger' };
      default: return { text: status, class: '' };
    }
  };

  return (
    <div className="view-content-active">
      <h1 className="view-title">Historial de Pagos</h1>
      
      <div className="tickets-list">
        {tickets.map(ticket => {
          const statusInfo = getStatusLabel(ticket.status);
          const needsSupport = ticket.status === 'pending_audit' || ticket.status === 'rejected';
          
          return (
            <div key={ticket.id} className="ticket-card card">
              <div className="ticket-header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span className="ticket-id">{ticket.id} {ticket.reference ? `(${ticket.reference})` : ''}</span>
                  {ticket.name && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Reportado por: {ticket.name}
                    </span>
                  )}
                </div>
                <span className={`ticket-status ${statusInfo.class}`}>{statusInfo.text}</span>
              </div>
              
              <div className="ticket-details">
                <div className="detail-col">
                  <span className="detail-label">Fecha</span>
                  <span className="detail-val">{ticket.date}</span>
                </div>
                <div className="detail-col">
                  <span className="detail-label">Método</span>
                  <span className="detail-val">{ticket.method} ({ticket.bank})</span>
                </div>
                <div className="detail-col">
                  <span className="detail-label">Monto Reportado</span>
                  <span className="detail-val">${ticket.amount.toFixed(2)}</span>
                </div>
              </div>

              {needsSupport && (
                <div className="ticket-support">
                  <p className="support-msg">
                    {ticket.status === 'rejected' 
                      ? 'Este pago fue rechazado por fondos insuficientes o referencia inválida.' 
                      : 'Este pago requiere revisión manual por la caja.'}
                  </p>
                  <a 
                    href="https://wa.me/584120000000" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-whatsapp"
                  >
                    Contactar Caja por WhatsApp
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
