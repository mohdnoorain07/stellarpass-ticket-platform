import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { ThemeProvider } from './lib/ThemeContext';

const walletMocks = vi.hoisted(() => ({
  checkWalletConnection: vi.fn(),
}));

vi.mock('./lib/wallet', () => ({
  checkWalletConnection: walletMocks.checkWalletConnection,
  connectWallet: vi.fn(),
}));

vi.mock('./lib/contracts', () => ({
  getTicketAdminAddress: vi.fn(() => 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'),
  getTicketContractId: vi.fn(() => 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM'),
  submitContractAction: vi.fn(),
}));

function renderAt(path: string) {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('StellarPass routes', () => {
  beforeEach(() => {
    walletMocks.checkWalletConnection.mockResolvedValue({ isConnected: false, publicKey: null, error: null });
  });

  it('renders the landing page', () => {
    renderAt('/');

    expect(screen.getByRole('heading', { name: /Decentralized event ticketing/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore Events' })).toHaveAttribute('href', '/events');
  });

  it('rejects an invalid ticket code before a wallet transaction is attempted', () => {
    renderAt('/check-in');

    fireEvent.change(screen.getByLabelText('Ticket Code'), { target: { value: 'not-a-ticket' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Gate Entry' }));

    expect(screen.getByText('Enter a valid StellarPass ticket code.')).toBeInTheDocument();
  });
});

