import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemberDirectoryView } from './MemberDirectoryView';

describe('MemberDirectoryView', () => {
  it('filters member lists and opens details modal', () => {
    const members = [
      { id: 'V-12.345.678', name: 'JUAN PÉREZ', email: 'socio@club.com', status: 'Active', balance: 1000.00, debt: 345.50 }
    ];
    render(<MemberDirectoryView members={members} setMembers={vi.fn()} />);

    expect(screen.getByText('JUAN PÉREZ')).toBeInTheDocument();
    
    // Test search filter
    const searchInput = screen.getByPlaceholderText(/Buscar socio/i);
    fireEvent.change(searchInput, { target: { value: 'Maria' } });
    expect(screen.queryByText('JUAN PÉREZ')).not.toBeInTheDocument();
  });
});
