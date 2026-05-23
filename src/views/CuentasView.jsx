import React, { useState } from 'react';
import './CuentasView.css';
import { PaymentModal } from '../components/PaymentModal';

export function CuentasView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const mockBills = [
    { id: '1', invoice: 'F-2026001', date: '2026-05-20', description: 'Consumo Restaurante', amountUsd: 45.00 },
    { id: '2', invoice: 'F-2026005', date: '2026-05-21', description: 'Mantenimiento Marina', amountUsd: 120.00 },
    { id: '3', invoice: 'F-2026012', date: '2026-05-22', description: 'Torneo de Tenis', amountUsd: 25.00 }
  ];

  const bcvRate = 92.45;

  const handlePayBank = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  return (
    <div className="view-content-active">
      <h1 className="view-title">Cuentas por Pagar</h1>
      
      <div className="bills-list">
        {mockBills.map(bill => (
          <div key={bill.id} className="bill-card card">
            <div className="bill-header">
              <span className="invoice-number">{bill.invoice}</span>
              <span className="bill-date">{bill.date}</span>
            </div>
            <p className="bill-desc">{bill.description}</p>
            <div className="bill-amounts">
              <span className="bill-usd">${bill.amountUsd.toFixed(2)}</span>
              <span className="bill-ves">Bs. {(bill.amountUsd * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="bill-actions">
              <button className="btn btn-secondary" onClick={() => alert('Pagado con crédito del club (Mock)')}>
                Pagar con Crédito
              </button>
              <button className="btn btn-primary" onClick={() => handlePayBank(bill)}>
                Reportar Pago Banco
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <PaymentModal 
          bill={selectedBill} 
          bcvRate={bcvRate}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
