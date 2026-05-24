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

  it('triggers quick login for Socio Demo button click', () => {
    const handleLogin = vi.fn();
    render(<LoginView onLogin={handleLogin} />);
    
    const socioDemoBtn = screen.getByRole('button', { name: /Socio Demo/i });
    fireEvent.click(socioDemoBtn);
    
    expect(handleLogin).toHaveBeenCalledWith({ email: 'socio@club.com', role: 'member' });
  });

  it('triggers quick login for Staff Demo button click', () => {
    const handleLogin = vi.fn();
    render(<LoginView onLogin={handleLogin} />);
    
    const staffDemoBtn = screen.getByRole('button', { name: /Staff Demo/i });
    fireEvent.click(staffDemoBtn);
    
    expect(handleLogin).toHaveBeenCalledWith({ email: 'staff@club.com', role: 'staff' });
  });
});
