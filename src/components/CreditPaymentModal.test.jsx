import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreditPaymentModal } from './CreditPaymentModal';

describe('CreditPaymentModal', () => {
  const mockBill = {
    invoice: 'INV-103',
    description: 'Mensualidad Club Mayo',
    amountUsd: 100.00,
    items: [
      { name: 'Cuota de Membresía Mayo 2026', qty: 1, price: 80.00 },
      { name: 'Contribución Fondo Deportes', qty: 1, price: 20.00 }
    ]
  };

  const mockMember = {
    balance: 1000.00, // Credit limit
    debt: 345.50
  };

  it('renders Step 1 with invoice items and totals', () => {
    const handleClose = vi.fn();
    render(
      <CreditPaymentModal 
        bill={mockBill} 
        member={mockMember} 
        onConfirm={vi.fn()} 
        onClose={handleClose} 
      />
    );

    expect(screen.getByText('Paso 1: Detalles de Facturación')).toBeInTheDocument();
    expect(screen.getByText('Cuota de Membresía Mayo 2026')).toBeInTheDocument();
    expect(screen.getByText('Contribución Fondo Deportes')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('navigates to Step 2 and allows confirmation when credit is sufficient', () => {
    const handleConfirm = vi.fn();
    render(
      <CreditPaymentModal 
        bill={mockBill} 
        member={mockMember} 
        onConfirm={handleConfirm} 
        onClose={vi.fn()} 
      />
    );

    // Click Continue to step 2
    fireEvent.click(screen.getByText('Continuar'));

    expect(screen.getByText('Paso 2: Confirmación de Línea de Crédito')).toBeInTheDocument();
    expect(screen.getByText('$654.50')).toBeInTheDocument(); // Available credit (1000 - 345.50)
    expect(screen.getByText('$445.50')).toBeInTheDocument(); // Debt after (345.50 + 100.00)

    // Click Confirm button
    const confirmBtn = screen.getByText('Confirmar Pago con Crédito');
    expect(confirmBtn).not.toBeDisabled();
    fireEvent.click(confirmBtn);

    expect(handleConfirm).toHaveBeenCalledWith(mockBill);
  });

  it('displays alert and disables confirm button when credit is insufficient', () => {
    const lowCreditMember = {
      balance: 200.00,
      debt: 150.00 // Available: 50.00, Bill: 100.00
    };

    render(
      <CreditPaymentModal 
        bill={mockBill} 
        member={lowCreditMember} 
        onConfirm={vi.fn()} 
        onClose={vi.fn()} 
      />
    );

    fireEvent.click(screen.getByText('Continuar'));

    expect(screen.getByText(/Crédito Insuficiente/i)).toBeInTheDocument();
    const confirmBtn = screen.getByText('Confirmar Pago con Crédito');
    expect(confirmBtn).toBeDisabled();
  });
});
