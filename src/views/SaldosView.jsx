import React from 'react';
import './SaldosView.css';

export function SaldosView() {
  const limitUsd = 1000.00;
  const balanceUsedUsd = 345.50;
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
          <p className="card-number">V-12.345.678</p>
          <p className="card-name">JUAN PÉREZ</p>
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
