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

  it('renders the landing page', async () => {
    renderAt('/');

    expect(await screen.findByRole('heading', { name: /Decentralized event ticketing/i })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Explore Events' })).toHaveAttribute('href', '/events');
  });

  it('rejects an invalid ticket code before a wallet transaction is attempted', async () => {
    walletMocks.checkWalletConnection.mockResolvedValue({
      isConnected: true,
      publicKey: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
      error: null,
    });
    renderAt('/check-in');

    const input = await screen.findByLabelText('Ticket Code');
    fireEvent.change(input, { target: { value: 'not-a-ticket' } });

    const button = await screen.findByRole('button', { name: 'Confirm Gate Entry' });
    fireEvent.click(button);

    expect(await screen.findByText('Enter a valid StellarPass ticket code.')).toBeInTheDocument();
  });

  it('hides the check-in panel from non-admin users', async () => {
    walletMocks.checkWalletConnection.mockResolvedValue({
      isConnected: true,
      publicKey: 'GDANQLG4VQFO2XQ2QFGWAMKJKDEAOXBZMDAD6ZMRZOAEHBRI3Y5N2ONTSU',
      error: null,
    });
    renderAt('/check-in');

    expect(
      await screen.findByText(/This panel is restricted to the ticket contract administrator/i)
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Ticket Code')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirm Gate Entry' })).not.toBeInTheDocument();
  });
});
