import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginView } from './LoginView';

describe('LoginView', () => {
  it('renders login form and submits with helper credentials', () => {
    const handleLogin = vi.fn();
    render(<LoginView onLogin={handleLogin} />);
    
    expect(screen.getByText('Portal Club Náutico')).toBeInTheDocument();
    
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const loginButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    
    fireEvent.change(emailInput, { target: { value: 'staff@club.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);
    
    expect(handleLogin).toHaveBeenCalledWith({ email: 'staff@club.com', role: 'staff' });
  });
});
