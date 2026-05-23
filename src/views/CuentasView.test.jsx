import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CuentasView } from './CuentasView';

describe('CuentasView', () => {
  it('renders a list of pending bills', () => {
    render(<CuentasView />);
    
    expect(screen.getByText('Cuentas por Pagar')).toBeInTheDocument();
    expect(screen.getByText('F-2026001')).toBeInTheDocument();
    expect(screen.getByText('Consumo Restaurante')).toBeInTheDocument();
    expect(screen.getByText('$45.00')).toBeInTheDocument();
  });

  it('opens payment modal when Reportar Pago Banco is clicked', () => {
    render(<CuentasView />);
    
    // Find the first report button
    const reportBtns = screen.getAllByText('Reportar Pago Banco');
    fireEvent.click(reportBtns[0]);
    
    // Modal should appear
    expect(screen.getByText('Reportar Pago')).toBeInTheDocument();
    expect(screen.getByText('Factura: F-2026001')).toBeInTheDocument();
    
    // Close modal
    const closeBtn = screen.getByText('×');
    fireEvent.click(closeBtn);
    
    expect(screen.queryByText('Reportar Pago')).not.toBeInTheDocument();
  });
});
