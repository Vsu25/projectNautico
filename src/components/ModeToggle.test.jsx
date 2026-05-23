import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModeToggle } from './ModeToggle';

describe('ModeToggle', () => {
  it('toggles from dark to light mode on click', () => {
    const handleToggle = vi.fn();
    render(<ModeToggle mode="dark" onToggle={handleToggle} />);
    
    const btn = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(screen.getByText('🌙')).toBeInTheDocument();
    
    fireEvent.click(btn);
    expect(handleToggle).toHaveBeenCalledWith('light');
  });

  it('toggles from light to dark mode on click', () => {
    const handleToggle = vi.fn();
    render(<ModeToggle mode="light" onToggle={handleToggle} />);
    
    const btn = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(screen.getByText('☀️')).toBeInTheDocument();
    
    fireEvent.click(btn);
    expect(handleToggle).toHaveBeenCalledWith('dark');
  });
});
