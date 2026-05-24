import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './CreditPaymentModal.css';

export function CreditPaymentModal({ bill, member, onConfirm, onClose }) {
  const [step, setStep] = useState(1);
  const items = bill.items || [{ name: bill.description, qty: 1, price: bill.amountUsd }];

  const availableCredit = member ? (member.balance - member.debt) : 1000.00;
  const currentDebt = member ? member.debt : 345.50;
  const canAfford = availableCredit >= bill.amountUsd;

  const handleConfirm = () => {
    onConfirm(bill);
    onClose();
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content card view-content-active">
        <div className="modal-header">
          <h2>Pagar con Crédito</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <p className="modal-subtitle">Factura: {bill.invoice}</p>

        {step === 1 ? (
          <div className="step-container">
            <h3 className="step-title">Paso 1: Detalles de Facturación</h3>
            
            <div className="bill-reason-box" style={{ marginBottom: '1.25rem' }}>
              <span className="reason-label">Motivo de Facturación / Concepto</span>
              <strong className="reason-text">{bill.description}</strong>
            </div>

            <div className="table-responsive" style={{ margin: '1rem 0' }}>
              <table className="mini-trace-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th style={{ textAlign: 'center' }}>Cant.</th>
                    <th style={{ textAlign: 'right' }}>Precio</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td style={{ textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}>${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 'bold', borderTop: '2px solid var(--color-border)' }}>
                    <td colSpan="3">Total a Pagar</td>
                    <td style={{ textAlign: 'right' }}>${bill.amountUsd.toFixed(2)} REF</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                Continuar
              </button>
            </div>
          </div>
        ) : (
          <div className="step-container">
            <h3 className="step-title">Paso 2: Confirmación de Línea de Crédito</h3>

            <div className="credit-summary card" style={{ padding: '1.2rem', margin: '1.2rem 0', background: 'rgba(255,255,255,0.02)', border: 'var(--border-card)' }}>
              <div className="summary-row" style={{ display: 'flex', justifycontent: 'space-between', marginBottom: '0.8rem' }}>
                <span>Crédito Disponible:</span>
                <strong>${availableCredit.toFixed(2)}</strong>
              </div>
              <div className="summary-row" style={{ display: 'flex', justifycontent: 'space-between', marginBottom: '0.8rem' }}>
                <span>Monto Factura:</span>
                <span className="text-danger" style={{ fontWeight: '600' }}>-${bill.amountUsd.toFixed(2)}</span>
              </div>
              
              <hr style={{ border: '0', borderTop: 'var(--border-card)', margin: '0.8rem 0' }} />

              <div className="summary-row" style={{ display: 'flex', justifycontent: 'space-between', marginBottom: '0.8rem' }}>
                <span>Saldo Deudor Actual:</span>
                <span>${currentDebt.toFixed(2)}</span>
              </div>
              <div className="summary-row" style={{ display: 'flex', justifycontent: 'space-between', fontWeight: 'bold' }}>
                <span>Saldo Deudor Después:</span>
                <span className="text-warning">${(currentDebt + bill.amountUsd).toFixed(2)}</span>
              </div>
            </div>

            {!canAfford && (
              <div className="alert alert-danger" style={{ padding: '0.8rem', background: 'rgba(255,107,107,0.15)', color: '#FF6B6B', borderRadius: '8px', marginBottom: '1.2rem', fontSize: '0.85rem' }}>
                ⚠️ <strong>Crédito Insuficiente:</strong> No posee suficiente saldo disponible en su línea de crédito para realizar este pago.
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Atrás</button>
              <button 
                className="btn btn-primary" 
                onClick={handleConfirm}
                disabled={!canAfford}
              >
                Confirmar Pago con Crédito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
