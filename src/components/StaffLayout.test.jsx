import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StaffLayout } from './StaffLayout';

describe('StaffLayout', () => {
  it('renders top navbar, role indicator and handles logout clicks', () => {
    const handleTabChange = vi.fn();
    const handleLogout = vi.fn();
    
    render(
      <StaffLayout 
        currentTab="verify" 
        onChangeTab={handleTabChange}
        theme="glass"
        onChangeTheme={vi.fn()}
        mode="dark"
        onChangeMode={vi.fn()}
        onLogout={handleLogout}
      >
        <div data-testid="child">Content</div>
      </StaffLayout>
    );
    
    expect(screen.getByText(/Panel Administrativo/i)).toBeInTheDocument();
    expect(screen.getByText(/Verificar Pagos/i)).toBeInTheDocument();
    expect(screen.getByText(/Transacciones/i)).toBeInTheDocument();
    
    const logoutBtn = screen.getByRole('button', { name: /Salir/i });
    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalled();
  });
});
