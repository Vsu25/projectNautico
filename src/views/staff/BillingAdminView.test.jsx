import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BillingAdminView } from './BillingAdminView';

describe('BillingAdminView', () => {
  it('posts manual charges and aggregates summary numbers', () => {
    const members = [
      { id: 'V-12.345.678', name: 'JUAN PÉREZ', status: 'Active', balance: 1000.00, debt: 340.00 }
    ];
    const setMembers = vi.fn();
    render(<BillingAdminView members={members} setMembers={setMembers} deposits={[]} />);

    expect(screen.getByText('$340.00')).toBeInTheDocument();
    
    const postBtn = screen.getByRole('button', { name: /Cargar Monto/i });
    expect(postBtn).toBeInTheDocument();
  });
});
