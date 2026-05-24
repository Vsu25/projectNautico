import React, { useState } from 'react';
import './BillingAdminView.css';

export function BillingAdminView({ members, setMembers, deposits }) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [chargeAmount, setChargeAmount] = useState('');
  const [chargeConcept, setChargeConcept] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Metrics
  const totalOutstandingDebt = members.reduce((acc, curr) => acc + curr.debt, 0);
  const totalCollections = deposits
    .filter(d => d.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleManualChargeSubmit = (e) => {
    e.preventDefault();
    if (!selectedMemberId || !chargeAmount) return;

    const amountNum = parseFloat(chargeAmount);
    setMembers(prev => prev.map(m => {
      if (m.id === selectedMemberId) {
        return {
          ...m,
          debt: m.debt + amountNum
        };
      }
      return m;
    }));

    setSuccessMessage(`Cargo de $${amountNum.toFixed(2)} aplicado exitosamente.`);
    setChargeAmount('');
    setChargeConcept('');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleGenerateMonthlyFees = () => {
    // Post standard monthly fee of $100 to all Active members
    const feeAmount = 100.00;
    setMembers(prev => prev.map(m => {
      if (m.status === 'Active') {
        return {
          ...m,
          debt: m.debt + feeAmount
        };
      }
      return m;
    }));
    
    setSuccessMessage('Cuotas mensuales de $100.00 aplicadas a todos los socios activos.');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="view-content-active">
      <div className="view-header">
        <h2>Cobros & Facturación</h2>
        <p className="subtitle">Configuración de tarifas, facturación mensual y cobros extraordinarios</p>
      </div>

      {successMessage && (
        <div className="card alert-success">
          {successMessage}
        </div>
      )}

      {/* Analytics Summary */}
      <div className="metrics-grid">
        <div className="card metric-card">
          <span className="metric-icon">💰</span>
          <div>
            <span className="metric-label">Recaudación Mensual (Aprobada)</span>
            <strong className="metric-val text-success">${totalCollections.toFixed(2)}</strong>
          </div>
        </div>
        <div className="card metric-card">
          <span className="metric-icon">📉</span>
          <div>
            <span className="metric-label">Cuentas por Cobrar (Deuda Total)</span>
            <strong className="metric-val text-danger">${totalOutstandingDebt.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div className="billing-grid">
        {/* Manual Charge Form */}
        <div className="card billing-form-card">
          <h3>Cargar Cuota Individual</h3>
          <form onSubmit={handleManualChargeSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label className="input-label">Seleccionar Socio</label>
              <select 
                className="billing-select"
                value={selectedMemberId}
                onChange={e => setSelectedMemberId(e.target.value)}
                required
              >
                <option value="">-- Seleccionar Socio --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Concepto de Cobro</label>
              <input 
                type="text" 
                placeholder="Ej. Cuota Marina Extra, Alquiler Muelle"
                className="billing-input"
                value={chargeConcept}
                onChange={e => setChargeConcept(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Monto ($)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="Monto a cobrar"
                className="billing-input"
                value={chargeAmount}
                onChange={e => setChargeAmount(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary billing-submit-btn">
              Cargar Monto
            </button>
          </form>
        </div>

        {/* Action Panel */}
        <div className="card mass-invoicing-card">
          <h3>Facturación Masiva</h3>
          <p style={{ margin: '1rem 0', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Cargue automáticamente la cuota ordinaria mensual de membresía a todos los socios del club que se encuentren en estado <strong>Activo</strong>.
          </p>
          
          <div className="fee-preview-box">
            <span className="fee-preview-label">Cuota Mensual Estándar</span>
            <strong className="fee-preview-val">$100.00</strong>
          </div>

          <button className="btn btn-primary mass-btn" onClick={handleGenerateMonthlyFees}>
            ⚡ Generar Facturación Mensual
          </button>
        </div>
      </div>
    </div>
  );
}
