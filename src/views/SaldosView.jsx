import React from 'react';
import './SaldosView.css';

export function SaldosView({ currentUser, members }) {
  // Look up real-time member data or fall back to mock defaults
  const memberData = members?.find(m => m.id === currentUser?.id) || {
    id: currentUser?.id || 'V-12.345.678',
    name: currentUser?.name || 'JUAN PÉREZ',
    balance: 1000.00,
    debt: 345.50,
    accountNumber: currentUser?.accountNumber || '01187'
  };

  const limitUsd = memberData.balance;
  const balanceUsedUsd = memberData.debt;
  const bcvRate = 92.45;
  const balanceVes = balanceUsedUsd * bcvRate;

  return (
    <div className="view-content-active">
      <h1 className="view-title">Saldos y Crédito</h1>
      
      <div className="credit-card-widget">
        <div className="card-shimmer"></div>
        <div className="card-header">
          <span className="card-logo">CNM</span>
          <span className="card-type">Socio Principal</span>
        </div>
        <div className="card-body">
          <p className="card-number">{memberData.id}</p>
          <p className="card-name">
            {memberData.name}
            {memberData.accountNumber && <span className="card-account-num" style={{ color: 'var(--color-accent)', marginLeft: '0.5rem', fontWeight: 'bold' }}>#{memberData.accountNumber}</span>}
          </p>
        </div>
        <div className="card-footer">
          <div className="card-detail">
            <span className="detail-label">Límite Autorizado</span>
            <span className="detail-value">${limitUsd.toFixed(2)}</span>
          </div>
          <div className="card-detail">
            <span className="detail-label">Disponible</span>
            <span className="detail-value">${(limitUsd - balanceUsedUsd).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="balance-summary card">
        <h3>Deuda Consumida</h3>
        <div className="balance-amounts">
          <div className="amount usd-amount">
            <span className="currency">USD</span>
            <span className="value">${balanceUsedUsd.toFixed(2)}</span>
          </div>
          <div className="amount ves-amount">
            <span className="currency">VES</span>
            <span className="value">Bs. {balanceVes.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <p className="bcv-note">Calculado a la tasa oficial BCV activa: <strong>{bcvRate}</strong> VES/USD</p>
      </div>
    </div>
  );
}
