import React, { useState } from 'react';
import './PaymentModal.css';

export function PaymentModal({ bill, bcvRate, onClose }) {
  const [amountVes, setAmountVes] = useState((bill.amountUsd * bcvRate).toFixed(2));
  const amountUsdCalculated = (parseFloat(amountVes) || 0) / bcvRate;

  return (
    <div className="modal-overlay">
      <div className="modal-content card view-content-active">
        <div className="modal-header">
          <h2>Reportar Pago</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <p className="modal-subtitle">Factura: {bill.invoice}</p>

        <form className="payment-form" onSubmit={(e) => { e.preventDefault(); alert('Reporte enviado con éxito (Mock)'); onClose(); }}>
          <div className="form-group">
            <label>Método de Pago</label>
            <select required>
              <option value="transfer">Transferencia Bancaria</option>
              <option value="mobile_payment">Pago Móvil</option>
            </select>
          </div>

          <div className="form-group">
            <label>Banco de Origen</label>
            <select required>
              <option value="">Seleccione el banco</option>
              <option value="0102">Banco de Venezuela (0102)</option>
              <option value="0105">Mercantil (0105)</option>
              <option value="0108">Provincial (0108)</option>
              <option value="0134">Banesco (0134)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Número de Referencia</label>
            <input type="text" placeholder="Últimos 6 dígitos mínimos" required pattern="\d{6,}" />
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

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Enviar Reporte</button>
          </div>
        </form>
      </div>
    </div>
  );
}
