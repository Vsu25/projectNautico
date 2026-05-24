import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BillingAdminView } from './BillingAdminView';

describe('BillingAdminView', () => {
  it('renders read-only billing metrics and consumption transcripts from DB', () => {
    const mockMembers = [
      { id: 'V-12.345.678', name: 'JUAN PÉREZ', status: 'Active', balance: 1000.00, debt: 340.00 }
    ];
    const mockPurchases = [
      { id: 'INV-101', user_id: 'V-12.345.678', amount_usd: 150.00, description: 'La Marina Meal', status: 'pending', created_at: '2026-05-23' }
    ];

    render(<BillingAdminView members={mockMembers} purchases={mockPurchases} />);

    // Test consolidated metrics
    expect(screen.getByText('Facturación Acumulada')).toBeInTheDocument();
    expect(screen.getAllByText('$150.00')).toHaveLength(2);
    expect(screen.getByText('Cuentas por Cobrar Totales (Deuda Activa)')).toBeInTheDocument();
    expect(screen.getByText('$340.00')).toBeInTheDocument();

    // Test invoice table list
    expect(screen.getByText('La Marina Meal')).toBeInTheDocument();
    expect(screen.getByText('INV-101')).toBeInTheDocument();
    expect(screen.getByText('Pendiente de Pago')).toBeInTheDocument();
  });
});
