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
});
