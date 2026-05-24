import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VerifyDepositsView } from './VerifyDepositsView';

describe('VerifyDepositsView', () => {
  it('displays pending deposits and processes approvals', () => {
    const deposits = [
      { id: 'DEP-001', memberId: 'V-12.345.678', name: 'JUAN PÉREZ', date: '2026-05-23', amount: 150.00, reference: 'REF982347', status: 'Pending', receipt: 'receipt_mock.png' }
    ];
    const members = [
      { id: 'V-12.345.678', name: 'JUAN PÉREZ', status: 'Active', balance: 1000.00, debt: 345.50 }
    ];
    const setDeposits = vi.fn();
    const setMembers = vi.fn();

    render(
      <VerifyDepositsView 
        deposits={deposits} 
        setDeposits={setDeposits} 
        members={members} 
        setMembers={setMembers} 
      />
    );

    expect(screen.getByText('REF982347')).toBeInTheDocument();
    
    const approveBtn = screen.getByRole('button', { name: /Aprobar/i });
    fireEvent.click(approveBtn);
    
    expect(setDeposits).toHaveBeenCalled();
    expect(setMembers).toHaveBeenCalled();
  });
});
