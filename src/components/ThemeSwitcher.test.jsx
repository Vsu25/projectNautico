import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeSwitcher } from './ThemeSwitcher';

describe('ThemeSwitcher', () => {
  it('renders three buttons and triggers onChangeTheme', () => {
    const handleChange = vi.fn();
    render(<ThemeSwitcher currentTheme="glass" onChangeTheme={handleChange} />);
    
    const flatBtn = screen.getByTestId('btn-flat');
    fireEvent.click(flatBtn);
    expect(handleChange).toHaveBeenCalledWith('flat');
    
    // Check if the current theme is highlighted
    const glassBtn = screen.getByTestId('btn-glass');
    expect(glassBtn).toHaveClass('active');
    expect(flatBtn).not.toHaveClass('active');
  });

  it('updates document element and localStorage', () => {
    const handleChange = vi.fn();
    render(<ThemeSwitcher currentTheme="brutalist" onChangeTheme={handleChange} />);
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('brutalist');
    expect(localStorage.getItem('portal-theme')).toBe('brutalist');
  });
});
