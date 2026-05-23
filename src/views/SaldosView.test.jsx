import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SaldosView } from './SaldosView';

describe('SaldosView', () => {
  it('renders credit card details and mock balances', () => {
    render(<SaldosView />);
    
    // Check if user card is rendered
    expect(screen.getByText('JUAN PÉREZ')).toBeInTheDocument();
    expect(screen.getByText('V-12.345.678')).toBeInTheDocument();
    
    // Check if limit is shown
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    
    // Check if debt value is shown
    expect(screen.getByText('$345.50')).toBeInTheDocument();
  });
});
