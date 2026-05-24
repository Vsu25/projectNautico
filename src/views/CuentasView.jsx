import React, { useState } from 'react';
import './CuentasView.css';
import { PaymentModal } from '../components/PaymentModal';
import { CreditPaymentModal } from '../components/CreditPaymentModal';

export function CuentasView({ purchases, setPurchases, members, setMembers, deposits, setDeposits, currentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Fallback mock data for testing when props are not provided
  const fallbackBills = [
    { 
      id: 'F-2026001', 
      invoice: 'F-2026001', 
      date: '2026-05-20', 
      description: 'Consumo Restaurante', 
      amountUsd: 45.00,
      items: [
        { name: 'Pollo a la Canasta', qty: 2, price: 15.00 },
        { name: 'Bebidas Nacionales', qty: 3, price: 3.00 },
        { name: 'Ración de Papas', qty: 1, price: 6.00 }
      ]
    },
    { 
      id: 'F-2026005', 
      invoice: 'F-2026005', 
      date: '2026-05-21', 
      description: 'Mantenimiento Marina', 
      amountUsd: 120.00,
      items: [
        { name: 'Limpieza de Casco', qty: 1, price: 90.00 },
        { name: 'Pintura Anti-incrustante', qty: 1, price: 30.00 }
      ]
    },
    { 
      id: 'F-2026012', 
      invoice: 'F-2026012', 
      date: '2026-05-22', 
      description: 'Torneo de Tenis', 
      amountUsd: 25.00,
      items: [
        { name: 'Inscripción Torneo Singles', qty: 1, price: 25.00 }
      ]
    }
  ];

  const bcvRate = 92.45;
  
  // Find all member IDs in the same account to aggregate family bills
  const userMember = members?.find(m => m.id === currentUser?.id);
  const userAccount = userMember?.accountNumber;
  const accountMemberIds = (members && userAccount)
    ? members.filter(m => m.accountNumber === userAccount).map(m => m.id)
    : [currentUser?.id];

  // Use real props if they exist, otherwise fallback
  const activeBills = (purchases && currentUser)
    ? purchases
        .filter(p => accountMemberIds.includes(p.user_id) && p.status === 'pending')
        .map(p => {
          const m = members?.find(member => member.id === p.user_id);
          return {
            id: p.id,
            invoice: p.id,
            date: p.created_at,
            description: p.description,
            amountUsd: p.amount_usd,
            items: p.items || [{ name: p.description, qty: 1, price: p.amount_usd }],
            memberDetails: m ? { name: m.name, accountNumber: m.accountNumber } : { name: currentUser.name, accountNumber: currentUser.accountNumber || '01187' }
          };
        })
    : fallbackBills.map(b => ({
        ...b,
        memberDetails: { name: 'JUAN PÉREZ', accountNumber: '01187' }
      }));

  const totalUsd = activeBills.reduce((sum, bill) => sum + bill.amountUsd, 0);

  const handlePayBank = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const handlePayCredit = (bill) => {
    setSelectedBill(bill);
    setIsCreditModalOpen(true);
  };

  const handlePayAll = () => {
    // Combine all bills into a single invoice structure
    const allItems = activeBills.flatMap(b => b.items || [{ name: b.description, qty: 1, price: b.amountUsd }]);
    setSelectedBill({
      id: 'INV-PAYALL',
      invoice: 'Varias Facturas (Pago Total)',
      date: new Date().toISOString().split('T')[0],
      description: 'Pago total de cuentas pendientes',
      amountUsd: totalUsd,
      items: allItems
    });
    setIsModalOpen(true);
  };

  const handleConfirmBankPayment = (paymentInfo) => {
    if (setDeposits && currentUser) {
      const newDep = {
        id: `DEP-${Date.now()}`,
        memberId: currentUser.id,
        name: currentUser.name || 'Socio',
        date: new Date().toISOString().split('T')[0],
        amount: paymentInfo.amountUsd,
        reference: paymentInfo.reference,
        status: 'Pending',
        receipt: 'receipt_mock.png',
        invoiceId: paymentInfo.billId
      };
      setDeposits(prev => [newDep, ...prev]);
      alert('Reporte de pago bancario enviado con éxito. Pendiente de verificación por caja.');
    } else {
      alert('Reporte enviado con éxito (Mock)');
    }
  };

  const handleConfirmCreditPayment = (bill) => {
    if (setPurchases && setMembers && currentUser) {
      // 1. Update purchase status
      if (bill.id === 'INV-PAYALL') {
        // Pay all pending bills
        const pendingIds = activeBills.map(b => b.id);
        setPurchases(prev => prev.map(p => pendingIds.includes(p.id) ? { ...p, status: 'paid_with_credit' } : p));
        setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, debt: m.debt + bill.amountUsd } : m));
      } else {
        setPurchases(prev => prev.map(p => p.id === bill.id ? { ...p, status: 'paid_with_credit' } : p));
        setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, debt: m.debt + bill.amountUsd } : m));
      }
      alert('Pago procesado con éxito usando su línea de crédito.');
    } else {
      alert('Pago con crédito procesado con éxito (Mock)');
    }
  };

  const currentMemberRecord = (members && currentUser) 
    ? members.find(m => m.id === currentUser.id) 
    : { balance: 1000.00, debt: 345.50 };

  return (
    <div className="view-content-active">
      <div className="cuentas-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', maxWidth: '800px' }}>
        <h1 className="view-title" style={{ marginBottom: 0 }}>Cuentas por Pagar</h1>
        {totalUsd > 0 && (
          <button className="btn btn-primary" onClick={handlePayAll}>
            Pagar Todas (${totalUsd.toFixed(2)})
          </button>
        )}
      </div>
      
      {activeBills.length === 0 ? (
        <div className="card empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
          <span className="big-icon" style={{ fontSize: '3rem' }}>🎉</span>
          <h3 style={{ marginTop: '1rem' }}>¡Al día!</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>No tiene cuentas pendientes por pagar en este momento.</p>
        </div>
      ) : (
        <div className="bills-list">
          {activeBills.map(bill => (
            <div key={bill.id} className="bill-card card">
              <div className="bill-header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                  <span className="invoice-number">{bill.invoice}</span>
                  {bill.memberDetails && (
                    <span className="bill-member-ref" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Socio: {bill.memberDetails.name} <strong style={{ color: 'var(--color-accent)' }}>#{bill.memberDetails.accountNumber}</strong>
                    </span>
                  )}
                </div>
                <span className="bill-date">{bill.date}</span>
              </div>
              <div className="bill-reason-box">
                <span className="reason-label">Motivo de Facturación / Concepto</span>
                <strong className="reason-text">{bill.description}</strong>
              </div>
              
              {/* Itemized list preview */}
              <div className="bill-items-preview" style={{ margin: '0.8rem 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)', background: 'rgba(0,0,0,0.05)', padding: '0.6rem', borderRadius: '4px' }}>
                <span style={{ fontWeight: '600', display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>Detalle de Consumo:</span>
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  {(bill.items || []).map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '0.2rem' }}>
                      {item.name} ({item.qty}x) — ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bill-amounts">
                <span className="bill-usd">${bill.amountUsd.toFixed(2)} REF</span>
              </div>
              <div className="bill-actions">
                <button className="btn btn-secondary" onClick={() => handlePayCredit(bill)}>
                  Pagar con Crédito
                </button>
                <button className="btn btn-primary" onClick={() => handlePayBank(bill)}>
                  Reportar Pago Banco
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedBill && (
        <PaymentModal 
          bill={selectedBill} 
          bcvRate={bcvRate}
          onConfirm={handleConfirmBankPayment}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBill(null);
          }} 
        />
      )}

      {isCreditModalOpen && selectedBill && (
        <CreditPaymentModal
          bill={selectedBill}
          member={currentMemberRecord}
          onConfirm={handleConfirmCreditPayment}
          onClose={() => {
            setIsCreditModalOpen(false);
            setSelectedBill(null);
          }}
        />
      )}
    </div>
  );
}
