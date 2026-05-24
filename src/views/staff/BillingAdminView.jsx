import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './BillingAdminView.css';

export function BillingAdminView({ members, purchases }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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
        <p className="subtitle" style={{ fontSize: '0.85rem' }}>Historial inalterable de compras reportadas por el sistema externo del Club Social (Haga clic en una fila para ver el detalle de artículos)</p>
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
                <tr key={p.id} onClick={() => setSelectedInvoice(p)} style={{ cursor: 'pointer' }} title="Haga clic para ver detalles de artículos">
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

      {/* Invoice details sub-modal */}
      {selectedInvoice && createPortal(
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%' }}>
            <header className="modal-header">
              <h3>Artículos de Factura</h3>
              <button className="btn-close" onClick={() => setSelectedInvoice(null)}>×</button>
            </header>
            <div className="modal-body">
              <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.4rem' }}>Factura: {selectedInvoice.id}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Socio: {selectedInvoice.user_id} | Fecha: {selectedInvoice.created_at}
              </p>
              
              <div className="table-responsive">
                <table className="mini-trace-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.05)' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Concepto</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>Cant.</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Precio</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedInvoice.items || [{ name: selectedInvoice.description, qty: 1, price: selectedInvoice.amount_usd }]).map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: 'var(--border-card)' }}>
                        <td style={{ padding: '0.5rem' }}>{item.name}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>${(item.qty * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 'bold' }}>
                      <td colSpan="3" style={{ padding: '0.5rem' }}>Total Facturado</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>${selectedInvoice.amount_usd.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
