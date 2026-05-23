import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfoView } from './InfoView';

describe('InfoView', () => {
  it('renders the payment guide correctly', () => {
    render(<InfoView />);
    
    // Check main title
    expect(screen.getByRole('heading', { name: /guía de pago/i })).toBeInTheDocument();
    
    // Check timeline steps
    expect(screen.getByText('Depositar o Transferir')).toBeInTheDocument();
    expect(screen.getByText('Reportar el Pago')).toBeInTheDocument();
    expect(screen.getByText('Validación')).toBeInTheDocument();
    
    // Check bank details exist
    expect(screen.getByText('Banco Banesco (0134)')).toBeInTheDocument();
    expect(screen.getByText('pagos@nautico.com.ve')).toBeInTheDocument();
  });
});
