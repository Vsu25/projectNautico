import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './PaymentModal.css';

export function PaymentModal({ bill, bcvRate, onConfirm, onClose }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('transfer');
  const [bank, setBank] = useState('');
  const [reference, setReference] = useState('');
  const [amountVes, setAmountVes] = useState((bill.amountUsd * bcvRate).toFixed(2));
  
  const amountUsdCalculated = (parseFloat(amountVes) || 0) / bcvRate;
  const items = bill.items || [{ name: bill.description, qty: 1, price: bill.amountUsd }];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onConfirm) {
      onConfirm({
        reference,
        bank,
        method,
        amountVes: parseFloat(amountVes),
        amountUsd: amountUsdCalculated,
        billId: bill.id,
        invoice: bill.invoice
      });
    } else {
      alert('Reporte enviado con éxito (Mock)');
    }
    onClose();
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content card view-content-active">
        <div className="modal-header">
          <h2>Reportar Pago</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <p className="modal-subtitle">Factura: {bill.invoice}</p>

        {step === 1 ? (
          <div className="step-container">
            <h3 className="step-title" style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid rgba(197, 168, 128, 0.2)', paddingBottom: '0.5rem' }}>
              Paso 1: Detalles de Facturación
            </h3>
            
            <div className="table-responsive" style={{ margin: '1rem 0' }}>
              <table className="mini-trace-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.05)' }}>
                    <th style={{ padding: '0.6rem', textAlign: 'left' }}>Concepto</th>
                    <th style={{ padding: '0.6rem', textAlign: 'center' }}>Cant.</th>
                    <th style={{ padding: '0.6rem', textAlign: 'right' }}>Precio</th>
                    <th style={{ padding: '0.6rem', textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: 'var(--border-card)' }}>
                      <td style={{ padding: '0.6rem' }}>{item.name}</td>
                      <td style={{ padding: '0.6rem', textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ padding: '0.6rem', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                      <td style={{ padding: '0.6rem', textAlign: 'right' }}>${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 'bold', borderTop: '2px solid var(--color-border)' }}>
                    <td colSpan="3" style={{ padding: '0.6rem' }}>Total USD</td>
                    <td style={{ padding: '0.6rem', textAlign: 'right' }}>${bill.amountUsd.toFixed(2)}</td>
                  </tr>
                  <tr style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>
                    <td colSpan="3" style={{ padding: '0.6rem' }}>Total VES (BCV {bcvRate})</td>
                    <td style={{ padding: '0.6rem', textAlign: 'right' }}>Bs. {(bill.amountUsd * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                Continuar a Pago
              </button>
            </div>
          </div>
        ) : (
          <form className="payment-form" onSubmit={handleSubmit}>
            <h3 className="step-title" style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid rgba(197, 168, 128, 0.2)', paddingBottom: '0.5rem' }}>
              Paso 2: Datos de Transferencia
            </h3>

            <div className="form-group">
              <label>Método de Pago</label>
              <select required value={method} onChange={e => setMethod(e.target.value)}>
                <option value="transfer">Transferencia Bancaria</option>
                <option value="mobile_payment">Pago Móvil</option>
              </select>
            </div>

            <div className="form-group">
              <label>Banco de Origen</label>
              <select required value={bank} onChange={e => setBank(e.target.value)}>
                <option value="">Seleccione el banco</option>
                <option value="0102">Banco de Venezuela (0102)</option>
                <option value="0105">Mercantil (0105)</option>
                <option value="0108">Provincial (0108)</option>
                <option value="0134">Banesco (0134)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Número de Referencia</label>
              <input 
                type="text" 
                placeholder="Últimos 6 dígitos mínimos" 
                required 
                pattern="\d{6,}" 
                value={reference} 
                onChange={e => setReference(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Monto en VES</label>
              <input 
                type="number" 
                step="0.01" 
                value={amountVes} 
                onChange={(e) => setAmountVes(e.target.value)} 
                required 
              />
              <small className="conversion-hint">Equivale a ~${amountUsdCalculated.toFixed(2)} USD</small>
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Atrás</button>
              <button type="submit" className="btn btn-primary">Enviar Reporte</button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
