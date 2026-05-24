import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PaymentsHistoryView } from './PaymentsHistoryView';

describe('PaymentsHistoryView', () => {
  it('renders list of all payments and status filters', () => {
    const deposits = [
      { id: 'DEP-001', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-23', amount: 150.00, reference: 'REF982347', status: 'Pending' },
      { id: 'DEP-002', memberId: 'V-23.456.789', name: 'MARÍA RODRÍGUEZ', date: '2026-05-22', amount: 100.00, reference: 'REF109283', status: 'auto_approved' }
    ];

    render(<PaymentsHistoryView deposits={deposits} />);
    expect(screen.getByText('REF982347')).toBeInTheDocument();
    expect(screen.getByText('REF109283')).toBeInTheDocument();
    expect(screen.getByText(/Automático/i)).toBeInTheDocument();
  });
});
