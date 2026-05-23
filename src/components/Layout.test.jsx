import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from './Layout';

describe('Layout', () => {
  it('renders navigation tabs and triggers onChangeTab', () => {
    const handleChangeTab = vi.fn();
    render(
      <Layout currentTab="saldos" onChangeTab={handleChangeTab} theme="glass" onChangeTheme={() => {}} mode="dark" onChangeMode={() => {}}>
        <div data-testid="child-content">Content</div>
      </Layout>
    );
    
    // Check if children are rendered
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    
    // Check if navigation tabs exist (since they are rendered twice: sidebar & bottomNav, we get all)
    const cuentasBtns = screen.getAllByText('Cuentas');
    expect(cuentasBtns.length).toBeGreaterThan(0);
    
    // Click the first one (from sidebar)
    fireEvent.click(cuentasBtns[0]);
    expect(handleChangeTab).toHaveBeenCalledWith('cuentas');
  });
});
