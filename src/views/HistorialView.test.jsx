import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HistorialView } from './HistorialView';

describe('HistorialView', () => {
  it('renders tickets and shows whatsapp button for pending/rejected', () => {
    render(<HistorialView />);
    
    // Check ticket renders
    expect(screen.getByText('T-9001')).toBeInTheDocument();
    expect(screen.getByText('Aprobado')).toBeInTheDocument();
    expect(screen.getByText('En Revisión')).toBeInTheDocument();
    expect(screen.getByText('Rechazado')).toBeInTheDocument();
    
    // Check if WhatsApp buttons are rendered (there should be 2 for the 3 tickets)
    const whatsappBtns = screen.getAllByText('Contactar Caja por WhatsApp');
    expect(whatsappBtns.length).toBe(2);
  });

  it('filters and displays deposits of all family members sharing the same account number', () => {
    const currentUser = { id: 'V-12.345.678', name: 'JUAN PÉREZ' };
    const members = [
      { id: 'V-12.345.678', name: 'JUAN PÉREZ', accountNumber: '01187' },
      { id: 'V-99.888.777', name: 'VICTOR PÉREZ', accountNumber: '01187' },
      { id: 'V-22.333.444', name: 'OTRO SOCIO', accountNumber: '99999' }
    ];
    const deposits = [
      { id: 'DEP-001', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-23', amount: 150.00, reference: 'REF123', status: 'Pending' },
      { id: 'DEP-002', memberId: 'V-99.888.777', name: 'VICTOR PÉREZ', date: '2026-05-24', amount: 100.00, reference: 'REF456', status: 'Approved' },
      { id: 'DEP-003', memberId: 'V-22.333.444', name: 'OTRO SOCIO', date: '2026-05-24', amount: 200.00, reference: 'REF789', status: 'Pending' }
    ];

    render(
      <HistorialView 
        currentUser={currentUser} 
        members={members} 
        deposits={deposits} 
      />
    );

    // Should render Juan and Victor's deposits
    expect(screen.getByText(/DEP-001/)).toBeInTheDocument();
    expect(screen.getByText(/Reportado por: JUAN PÉREZ/)).toBeInTheDocument();
    
    expect(screen.getByText(/DEP-002/)).toBeInTheDocument();
    expect(screen.getByText(/Reportado por: VICTOR PÉREZ/)).toBeInTheDocument();

    // Should NOT render Otro Socio's deposit
    expect(screen.queryByText(/DEP-003/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Reportado por: OTRO SOCIO/)).not.toBeInTheDocument();
  });
});
