import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemberDirectoryView } from './MemberDirectoryView';

describe('MemberDirectoryView', () => {
  const mockMembers = [
    { id: 'V-12.345.678', name: 'JUAN PÉREZ', email: 'socio@club.com', status: 'Active', balance: 1000.00, debt: 345.50 }
  ];
  const mockPurchases = [
    { id: 'INV-101', user_id: 'V-12.345.678', amount_usd: 150.00, description: 'La Marina Dinner', status: 'pending', created_at: '2026-05-23' }
  ];
  const mockDeposits = [
    { id: 'DEP-001', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-23', amount: 150.00, reference: 'REF982347', status: 'Pending' }
  ];

  it('filters member list and opens detailed profile drawer with audit history', () => {
    const handleSetMembers = vi.fn();
    render(
      <MemberDirectoryView 
        members={mockMembers} 
        setMembers={handleSetMembers}
        purchases={mockPurchases}
        deposits={mockDeposits}
      />
    );

    expect(screen.getByText('JUAN PÉREZ')).toBeInTheDocument();
    
    // Open details drawer
    const detailsBtn = screen.getByRole('button', { name: /Ver Detalles/i });
    fireEvent.click(detailsBtn);

    // Verify detail labels, credit limits adjustment, and audit grids render
    expect(screen.getByText('Ficha del Socio')).toBeInTheDocument();
    expect(screen.getByText('Gestionar Línea de Crédito')).toBeInTheDocument();
    expect(screen.getByText('Compras y Consumos (Externo DB Sync)')).toBeInTheDocument();
    expect(screen.getByText('La Marina Dinner')).toBeInTheDocument();
    expect(screen.getByText('Reportes de Pago Relacionados')).toBeInTheDocument();
    expect(screen.getByText('REF982347')).toBeInTheDocument();
  });
});
