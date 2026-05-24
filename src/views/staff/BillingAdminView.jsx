import React from 'react';
import './BillingAdminView.css';

export function BillingAdminView({ members, purchases }) {
  // Aggregate Metrics from State
  const totalReceivables = members.reduce((acc, m) => acc + m.debt, 0);
  const totalInvoicedUsd = purchases.reduce((acc, p) => acc + p.amount_usd, 0);
  const totalPaidUsd = purchases
    .filter(p => p.status !== 'pending')
    .reduce((acc, p) => acc + p.amount_usd, 0);

  return (
    <div className="view-content-active">
      <div className="view-header">
        <h2>Facturación & Transcripción</h2>
        <p className="subtitle">Registro histórico de facturas importadas del sistema de consumo del Club</p>
      </div>

      <div className="metrics-grid">
        <div className="card metric-card">
          <span className="metric-icon">📊</span>
          <div>
            <span className="metric-label">Facturación Acumulada</span>
            <strong className="metric-val">${totalInvoicedUsd.toFixed(2)}</strong>
          </div>
        </div>
        <div className="card metric-card">
          <span className="metric-icon">💰</span>
          <div>
            <span className="metric-label">Monto Liquidado (Socio Transfer/Crédito)</span>
            <strong className="metric-val text-success">${totalPaidUsd.toFixed(2)}</strong>
          </div>
        </div>
        <div className="card metric-card" style={{ gridColumn: 'span 2' }}>
          <span className="metric-icon">📉</span>
          <div>
            <span className="metric-label">Cuentas por Cobrar Totales (Deuda Activa)</span>
            <strong className="metric-val text-danger">${totalReceivables.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div className="view-header" style={{ marginTop: '2rem' }}>
        <h3>Transcripción de Consumos Sincronizados (DB Sync)</h3>
        <p className="subtitle" style={{ fontSize: '0.85rem' }}>Historial inalterable de compras reportadas por el sistema externo del Club Social</p>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Factura ID</th>
                <th>Cédula Socio</th>
                <th>Fecha Sincronización</th>
                <th>Concepto / Descripción</th>
                <th>Monto (USD)</th>
                <th>Estado de Liquidación</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p.id}>
                  <td><code>{p.id}</code></td>
                  <td><code>{p.user_id}</code></td>
                  <td>{p.created_at}</td>
                  <td>{p.description}</td>
                  <td className="font-weight-700">${p.amount_usd.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${p.status}`}>
                      {p.status === 'pending' && 'Pendiente de Pago'}
                      {p.status === 'paid_with_transfer' && 'Pagado Directo'}
                      {p.status === 'paid_with_credit' && 'Cargado a Crédito'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
