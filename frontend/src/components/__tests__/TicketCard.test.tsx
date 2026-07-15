import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TicketCard } from '../TicketCard';
import type { TicketItem } from '../../types';
import type { WalletState } from '../../lib/wallet';

const mockConnectedWallet: WalletState = {
  isConnected: true,
  publicKey: 'GA4SX4Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5',
  error: null,
};

const mockTicket: TicketItem = {
  id: 1,
  eventId: 42,
  eventTitle: 'Test Event',
  owner: 'GA4SX4Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5',
  used: false,
  forSale: false,
};

function renderTicketCard(ticket: TicketItem = mockTicket, wallet: WalletState = mockConnectedWallet) {
  const defaultProps = {
    ticket,
    wallet,
    isSubmitting: false,
    transferRecipient: '',
    resalePrice: '',
    onChangeTransferRecipient: vi.fn(),
    onChangeResalePrice: vi.fn(),
    onTransfer: vi.fn(),
    onOwnerCheckIn: vi.fn(),
    onListForResale: vi.fn(),
    onBuyResale: vi.fn(),
  };

  return render(<TicketCard {...defaultProps} />);
}

describe('TicketCard', () => {
  it('renders ticket ID and event title', () => {
    renderTicketCard();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('shows "Owned" badge when current user is the owner', () => {
    renderTicketCard();
    expect(screen.getByText('Owned')).toBeInTheDocument();
  });

  it('shows "Transferred" badge when user is not the owner', () => {
    const otherWallet: WalletState = {
      isConnected: true,
      publicKey: 'GB4SX4Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5',
      error: null,
    };
    renderTicketCard(mockTicket, otherWallet);
    expect(screen.getByText('Transferred')).toBeInTheDocument();
  });

  it('shows resale price and "Purchase" button when ticket is for sale', () => {
    const forSaleTicket: TicketItem = { ...mockTicket, forSale: true, salePrice: 250 };
    const otherWallet: WalletState = {
      isConnected: true,
      publicKey: 'GB4SX4Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5',
      error: null,
    };
    renderTicketCard(forSaleTicket, otherWallet);

    const priceElements = screen.getAllByText('250 XLM');
    expect(priceElements.length).toBe(2); // badge + price display
    expect(screen.getByText('Purchase')).toBeInTheDocument();
  });

  it('shows owner check-in and resale controls when user owns non-used, non-resale ticket', () => {
    renderTicketCard();
    expect(screen.getByText('Check In as Owner')).toBeInTheDocument();
    expect(screen.getByText('List for Resale')).toBeInTheDocument();
  });

  it('shows used badge when ticket is used', () => {
    const usedTicket: TicketItem = { ...mockTicket, used: true };
    renderTicketCard(usedTicket);
    expect(screen.getByText('This ticket has been used for entry.')).toBeInTheDocument();
  });

  it('hides owner check-in and resale controls when ticket is used', () => {
    const usedTicket: TicketItem = { ...mockTicket, used: true };
    renderTicketCard(usedTicket);
    expect(screen.queryByText('Check In as Owner')).not.toBeInTheDocument();
    expect(screen.queryByText('List for Resale')).not.toBeInTheDocument();
  });

  it('renders QR code with the correct StellarPass format', () => {
    renderTicketCard();
    const container = screen.getByText('stellarpass:ticket:1');
    expect(container).toBeInTheDocument();
  });

  it('disables buttons when isSubmitting is true', () => {
    const submittingProps = {
      ticket: mockTicket,
      wallet: mockConnectedWallet,
      isSubmitting: true,
      transferRecipient: '',
      resalePrice: '',
      onChangeTransferRecipient: vi.fn(),
      onChangeResalePrice: vi.fn(),
      onTransfer: vi.fn(),
      onOwnerCheckIn: vi.fn(),
      onListForResale: vi.fn(),
      onBuyResale: vi.fn(),
    };
    render(<TicketCard {...submittingProps} />);

    const transferButton = screen.getByText('Transfer').closest('button');
    expect(transferButton).toBeDisabled();
  });
});
