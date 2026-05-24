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

  it('opens credit payment modal and navigates steps when Pagar con Crédito is clicked', () => {
    render(<CuentasView />);
    
    const creditBtns = screen.getAllByText('Pagar con Crédito');
    fireEvent.click(creditBtns[0]);
    
    // Step 1 check
    expect(screen.getByRole('heading', { name: 'Pagar con Crédito' })).toBeInTheDocument();
    expect(screen.getByText('Paso 1: Detalles de Facturación')).toBeInTheDocument();
    expect(screen.getByText('Pollo a la Canasta')).toBeInTheDocument();
    
    // Go to step 2
    const continueBtn = screen.getByText('Continuar');
    fireEvent.click(continueBtn);
    
    expect(screen.getByText('Paso 2: Confirmación de Línea de Crédito')).toBeInTheDocument();
    expect(screen.getByText('Confirmar Pago con Crédito')).toBeInTheDocument();
    
    // Close modal
    const closeBtn = screen.getByText('×');
    fireEvent.click(closeBtn);
    
    expect(screen.queryByText('Paso 1: Detalles de Facturación')).not.toBeInTheDocument();
  });
});
